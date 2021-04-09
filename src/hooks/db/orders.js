import { useEffect, useState, useMemo, useCallback } from "react";
import { db } from "services/firebase";
import { useMounted } from "hooks";

function useOrders() {
    const [orders, setOrders] = useState(null);
    const [ordersHistory, setOrdersHistory] = useState(null);
    const mounted = useMounted();

    const status = useMemo(
        () => ({
            pending: "pending",
            inProgress: "inProgress",
            outForDelivery: "outForDelivery",
            delivered: "delivered",
            recused: "recused",
        }),
        []
    );

    const getOrders = useCallback(() => {
        db.collection("orders")
            .orderBy("createdAt", "asc")
            .get()
            .then((querySnapshot) => {
                const docs = [];

                querySnapshot.forEach((doc) => {
                    docs.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });

                const { delivered, ...statusAtt } = status;

                const initialStatus = Object.keys(statusAtt).reduce(
                    (acc, status) => {
                        acc[status] = [];
                        return acc;
                    },
                    {}
                );

                if (!mounted.current) {
                    return;
                }

                setOrders(
                    docs.reduce((acc, doc) => {
                        const mainStatus = doc.status || status.pending;

                        return {
                            ...acc,
                            [mainStatus]: acc[mainStatus].concat(doc),
                        };
                    }, initialStatus)
                );
            });
    }, [status, mounted]);

    const getOrdersHistoryDay = useCallback(async () => {
        db.collection("ordersHistory")
            .orderBy("createdAt", "asc")
            .get()
            .then((querySnapshot) => {
                const docs = [];

                const currentDate = new Intl.DateTimeFormat("pt-BR").format(
                    new Date()
                );

                if (!mounted.current) {
                    return;
                }
                querySnapshot.forEach((doc) => {
                    if (
                        new Intl.DateTimeFormat("pt-BR").format(
                            doc.data().createdAt.toDate()
                        ) === currentDate
                    ) {
                        docs.push({ id: doc.id, ...doc.data() });
                    }

                    if (!mounted.current) {
                        return;
                    }

                    setOrdersHistory(
                        docs.reduce(
                            (acc, doc) => {
                                const mainStatus = status.delivered;

                                return {
                                    ...acc,
                                    [mainStatus]: acc[mainStatus].concat(doc),
                                };
                            },
                            { delivered: [] }
                        )
                    );
                });
            });
    }, [status, mounted]);

    const fetchOrdersAndHistory = useCallback(() => {
        getOrders();
        getOrdersHistoryDay();
    }, [getOrders, getOrdersHistoryDay]);

    const addOrderHistory = useCallback(
        async ({ orderId, status }) => {
            const orderRef = db.collection("orders").doc(orderId);

            const orderHistoryRef = db.collection("ordersHistory").doc(orderId);

            db.runTransaction(async (transaction) => {
                const orderDoc = await transaction.get(orderRef);
                if (!orderDoc.exists) {
                    throw new Error("Esse tamanho não existe!");
                }

                transaction.delete(orderRef);

                transaction.set(orderHistoryRef, {
                    ...orderDoc.data(),
                    status,
                });
            })
                .then(() => {
                    fetchOrdersAndHistory();
                })
                .catch((e) => {
                    alert("Deu erro ao concluir o pedido!");
                });
        },
        [fetchOrdersAndHistory]
    );

    const addOrderRecused = useCallback(
        async ({ orderId, status }) => {
            const orderRef = db.collection("orders").doc(orderId);

            const orderHistoryRef = db.collection("ordersRecused").doc(orderId);

            db.runTransaction(async (transaction) => {
                const orderDoc = await transaction.get(orderRef);
                if (!orderDoc.exists) {
                    throw new Error("Esse tamanho não existe!");
                }

                transaction.delete(orderRef);

                transaction.set(orderHistoryRef, {
                    ...orderDoc.data(),
                    isView: false,
                    status,
                });
            })
                .then(() => {
                    fetchOrdersAndHistory();
                })
                .catch((e) => {
                    alert("Deu erro ao recusar o pedido!");
                    console.log("Erro ao recusar o pedido: ", e);
                });
        },
        [fetchOrdersAndHistory]
    );

    const updateOrder = useCallback(
        async ({ orderId, status }) => {
            await db.collection("orders").doc(orderId).set(
                {
                    status,
                },
                { merge: true }
            );

            getOrders();
        },
        [getOrders]
    );

    useEffect(() => {
        fetchOrdersAndHistory();
    }, [fetchOrdersAndHistory]);

    return {
        orders,
        ordersHistory,
        status,
        addOrderHistory,
        addOrderRecused,
        updateOrder,
    };
}

export default useOrders;
