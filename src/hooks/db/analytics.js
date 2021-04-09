import { useCallback, useMemo } from "react";
import { db } from "services/firebase";
import { useMounted } from "hooks";

function useAnalytics() {
    const today = new Date();
    const priorDate = new Date().setDate(today.getDate() - 30);
    const beginningDateObject = useMemo(() => new Date(priorDate), [priorDate]);
    const mounted = useMounted();

    const getDeliveredNumbers = useCallback(() => {
        return db
            .collection("ordersHistory")
            .where("createdAt", ">", beginningDateObject)
            .get()
            .then((querySnapshot) => {
                let pizzasMade = 0;
                let followsMade = 0;
                let drinksDelivered = 0;
                if (!mounted.current) {
                    return;
                }

                const numDelivered = querySnapshot.size;

                querySnapshot.forEach((doc) => {
                    doc.data().pizzas.map(
                        (pizza) =>
                            (pizzasMade = pizzasMade + parseInt(pizza.quantity))
                    );

                    doc.data().follows.map(
                        (follow) =>
                            (followsMade =
                                followsMade + parseInt(follow.quantity))
                    );

                    doc.data().drinks.map(
                        (drink) =>
                            (drinksDelivered =
                                drinksDelivered + parseInt(drink.quantity))
                    );
                });

                return {
                    numDelivered,
                    pizzasMade,
                    followsMade,
                    drinksDelivered,
                };
            });
    }, [mounted, beginningDateObject]);

    const getRecusedNumbers = useCallback(() => {
        return db
            .collection("ordersRecused")
            .where("createdAt", ">", beginningDateObject)
            .get()
            .then((querySnapshot) => {
                if (!mounted.current) {
                    return;
                }

                const numDelivered = querySnapshot.size;

                return numDelivered;
            });
    }, [mounted, beginningDateObject]);

    return { getDeliveredNumbers, getRecusedNumbers };
}

export default useAnalytics;
