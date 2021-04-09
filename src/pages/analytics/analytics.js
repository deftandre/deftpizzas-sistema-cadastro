import React, { useEffect, useState } from "react";
import { useAnalytics } from "hooks";
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";

import { Animation } from "@devexpress/dx-react-chart";

const Analytics = () => {
    const [deliveredNumber, setDeliveredNumber] = useState(0);
    const [recusedNumber, setRecusedNumber] = useState(0);
    const [pizzaDelivered, setPizzaDelivered] = useState(0);
    const [followsDelivered, setFollowsDelivered] = useState(0);
    const [drinksDelivered, setDrinksDelivered] = useState(0);
    const [chartData, setChartData] = useState([]);
    const { getDeliveredNumbers, getRecusedNumbers } = useAnalytics();

    useEffect(() => {
        async function fetchHistoryData() {
            const rn = await getRecusedNumbers();
            setRecusedNumber(rn);
        }

        fetchHistoryData();
    }, [getRecusedNumbers]);

    useEffect(() => {
        async function fetchDeliveredData() {
            const {
                numDelivered,
                pizzasMade,
                followsMade,
                drinksDelivered,
            } = await getDeliveredNumbers();
            setDeliveredNumber(numDelivered);
            setPizzaDelivered(pizzasMade);
            setFollowsDelivered(followsMade);
            setDrinksDelivered(drinksDelivered);
        }

        fetchDeliveredData();
    }, [getDeliveredNumbers]);

    useEffect(() => {
        setChartData([
            { number: deliveredNumber, argument: "Entregas feitas" },
            { number: recusedNumber, argument: "Pedidos recusados" },
            { number: pizzaDelivered, argument: "Pizzas" },
            { number: followsDelivered, argument: "Acompanhamentos" },
            { number: drinksDelivered, argument: "Bebidas" },
        ]);
    }, [
        deliveredNumber,
        recusedNumber,
        pizzaDelivered,
        followsDelivered,
        drinksDelivered,
    ]);

    return (
        <Chart data={chartData}>
            <ArgumentAxis />
            <ValueAxis max={7} />

            <BarSeries valueField="number" argumentField="argument" />
            <Title text="Informações de vendas dos últimos 30 dias" />
            <Animation />
        </Chart>
    );
};

export default Analytics;
