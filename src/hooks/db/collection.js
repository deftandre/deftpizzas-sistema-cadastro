import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "services/firebase";
import { useMounted } from "hooks";

function useCollection(collection) {
    const [data, setData] = useState(null);
    const { pathname } = useLocation();
    const mounted = useMounted();

    const orderBySizes = useCallback(
        (collection) => {
            return collection === "pizzasSizes"
                ? db
                      .collection(collection)
                      .orderBy("size", "asc")
                      .get()
                      .then((querySnapshot) => {
                          let docs = [];

                          querySnapshot.forEach((doc) => {
                              docs.push({
                                  id: doc.id,
                                  ...doc.data(),
                              });
                          });

                          if (mounted.current) {
                              setData(docs);
                          }
                      })
                : db
                      .collection(collection)
                      .get()
                      .then((querySnapshot) => {
                          let docs = [];

                          querySnapshot.forEach((doc) => {
                              docs.push({
                                  id: doc.id,
                                  ...doc.data(),
                              });
                          });

                          if (mounted.current) {
                              setData(docs);
                          }
                      });
        },
        [mounted]
    );

    const fetchCollectionData = useCallback(() => {
        orderBySizes(collection);
    }, [collection, orderBySizes]);

    const add = useCallback(
        (data) => {
            return db.collection(collection).add(data);
        },
        [collection]
    );

    const edit = useCallback(
        (id, data) => {
            return db.collection(collection).doc(id).set(data);
        },
        [collection]
    );

    const remove = useCallback(
        async (id) => {
            await db.collection(collection).doc(id).delete();
            fetchCollectionData();
        },
        [collection, fetchCollectionData]
    );

    const removePizzaSize = useCallback(
        async (id) => {
            const pizzaSizeRef = db.collection("pizzasSizes").doc(id);

            db.runTransaction(async (transaction) => {
                const sizeDoc = await transaction.get(pizzaSizeRef);
                if (!sizeDoc.exists) {
                    throw new Error("Esse tamanho não existe!");
                }

                transaction.delete(pizzaSizeRef);

                const allFlavours = await db.collection("pizzasFlavours").get();

                allFlavours.forEach((flavour) => {
                    const { [id]: sizeId, ...value } = flavour.data().value;
                    const flavourRef = db
                        .collection("pizzasFlavours")
                        .doc(flavour.id);
                    transaction.update(flavourRef, { value });
                });
            })
                .then(() => {
                    fetchCollectionData();
                })
                .catch((e) => console.log("Deu erro na remoção do tamanho", e));
        },
        [fetchCollectionData]
    );

    useEffect(() => {
        fetchCollectionData();
    }, [fetchCollectionData, pathname]);

    return { data, add, edit, remove, removePizzaSize };
}

export default useCollection;
