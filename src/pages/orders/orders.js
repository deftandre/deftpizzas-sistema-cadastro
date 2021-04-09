import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
    Button,
    Fab,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from "@material-ui/core";
import { Cancel, Check, DonutLarge, Motorcycle } from "@material-ui/icons";
import { TableContainer, TableTitle, Th, THead } from "ui";

import { useOrders } from "hooks";

import { singularOrPlural } from "utils";

function Orders() {
    const {
        orders,
        ordersHistory,
        status,
        addOrderHistory,
        addOrderRecused,
        updateOrder,
    } = useOrders();
    const [allOrders, setAllOrders] = useState(null);

    useEffect(() => {
        setAllOrders({ ...orders, ...ordersHistory });
    }, [orders, ordersHistory]);

    const allOrdersStatus = useMemo(() => {
        return [
            {
                title: "Pedidos pendentes",
                type: status.pending,
                nextAction: status.inProgress,
                nextButtonTitle: "Em produção",
                icon: DonutLarge,
                iconCancel: Cancel,
            },
            {
                title: "Pedidos em produção",
                type: status.inProgress,
                nextAction: status.outForDelivery,
                nextButtonTitle: "Saiu para entrega",
                icon: Motorcycle,
            },
            {
                title: "Saiu para entrega",
                type: status.outForDelivery,
                nextAction: status.delivered,
                nextButtonTitle: "Entregue",
                icon: Check,
            },
            {
                title: "Pedidos finalizados",
                type: status.delivered,
            },
        ];
    }, [status]);

    function getHour(date) {
        const options = {
            hour: "numeric",
            minute: "numeric",
        };
        return Intl.DateTimeFormat("pt-BR", options).format(date);
    }
    return allOrdersStatus.map((orderStatus) => (
        <TableContainer key={orderStatus.title}>
            <TableTitle key={orderStatus.title}>{orderStatus.title}</TableTitle>
            <Table>
                <THead>
                    <TableRow>
                        <Th>
                            <Typography>Informações do pedido</Typography>
                        </Th>
                        {orderStatus.nextAction && (
                            <Th align="center">
                                <Typography>Mudar Status</Typography>
                            </Th>
                        )}
                    </TableRow>
                </THead>

                <TableBody>
                    {allOrders?.[orderStatus.type]?.length === 0 && (
                        <TableRow>
                            <TableCell>
                                <Typography>
                                    Nenhum pedido com esse status.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    {allOrders?.[orderStatus.type]?.map((order) => {
                        const {
                            address,
                            number,
                            complement,
                            district,
                            code: cep,
                            city,
                            state,
                        } = order.address;
                        return (
                            <TableRow key={order.id}>
                                <TableCell>
                                    <div>
                                        <Subtitle>
                                            Horário do pedido:{" "}
                                            {getHour(order.createdAt.toDate())}
                                        </Subtitle>
                                    </div>
                                    <div>
                                        <Subtitle>Pedido:</Subtitle>

                                        <ul>
                                            {order.pizzas.map(
                                                (pizza, index) => (
                                                    <li key={index}>
                                                        <Typography>
                                                            {pizza.quantity}{" "}
                                                            {singularOrPlural(
                                                                pizza.quantity,
                                                                "pizza",
                                                                "pizzas"
                                                            )}{" "}
                                                            {singularOrPlural(
                                                                pizza.quantity,
                                                                pizza.size.name,
                                                                pizza.size
                                                                    .name + "s"
                                                            ).toUpperCase()}{" "}
                                                            de{" "}
                                                            {pizza.flavours
                                                                .map(
                                                                    (flavour) =>
                                                                        flavour.name
                                                                )
                                                                .reduce(
                                                                    (
                                                                        acc,
                                                                        flavour,
                                                                        index,
                                                                        array
                                                                    ) => {
                                                                        if (
                                                                            index ===
                                                                            0
                                                                        ) {
                                                                            return flavour;
                                                                        }

                                                                        if (
                                                                            index ===
                                                                            array.length -
                                                                                1
                                                                        ) {
                                                                            return `${acc} e ${flavour}`;
                                                                        }

                                                                        return `${acc}, ${flavour}`;
                                                                    },
                                                                    ""
                                                                )}
                                                        </Typography>
                                                    </li>
                                                )
                                            )}
                                        </ul>

                                        {order.follows.length !== 0 && (
                                            <Subtitle>
                                                Acompanhamentos:
                                            </Subtitle>
                                        )}

                                        {order.follows.length !== 0 && (
                                            <ul>
                                                {order.follows.map(
                                                    (follow, index) => (
                                                        <li key={index}>
                                                            <Typography>
                                                                {
                                                                    follow.quantity
                                                                }{" "}
                                                                {singularOrPlural(
                                                                    follow.quantity,
                                                                    "acompanhamento",
                                                                    "acompanhamentos"
                                                                )}{" "}
                                                                {
                                                                    follow
                                                                        .pizzaFollows
                                                                        .name
                                                                }
                                                            </Typography>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}

                                        {order.drinks.length !== 0 && (
                                            <Subtitle>Bebidas:</Subtitle>
                                        )}
                                        {order.drinks.length !== 0 && (
                                            <ul>
                                                {order.drinks.map(
                                                    (drink, index) => (
                                                        <li key={index}>
                                                            <Typography>
                                                                {drink.quantity}{" "}
                                                                {singularOrPlural(
                                                                    drink.quantity,
                                                                    "acompanhamento",
                                                                    "acompanhamentos"
                                                                )}{" "}
                                                                {
                                                                    drink
                                                                        .pizzaDrinks
                                                                        .name
                                                                }
                                                            </Typography>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                    <div>
                                        <div>
                                            <Subtitle>
                                                Cliente "{order.userName || ""}"
                                            </Subtitle>
                                        </div>
                                        <div>
                                            <Subtitle>
                                                Contato: {order.phone || ""}
                                            </Subtitle>
                                        </div>
                                        <Subtitle>
                                            Endereço de entrega:
                                        </Subtitle>
                                        <Typography>
                                            {address},{" "}
                                            {number && `nº ${number}`}{" "}
                                            {complement && `, ${complement}`}
                                            <br />
                                            Bairro: {district} - CEP: {cep}
                                            <br />
                                            {city} / {state}
                                        </Typography>
                                    </div>
                                </TableCell>
                                {orderStatus.nextAction && (
                                    <TableCell
                                        align="center"
                                        style={{ position: "relative" }}
                                    >
                                        <Fab
                                            color="primary"
                                            title={`Mudar status para "${orderStatus.nextButtonTitle}"`}
                                            onClick={() =>
                                                orderStatus.nextAction ===
                                                status.delivered
                                                    ? addOrderHistory({
                                                          orderId: order.id,
                                                          status:
                                                              orderStatus.nextAction,
                                                      })
                                                    : updateOrder({
                                                          orderId: order.id,
                                                          status:
                                                              orderStatus.nextAction,
                                                      })
                                            }
                                        >
                                            <orderStatus.icon />
                                        </Fab>
                                        {orderStatus.type ===
                                            status.pending && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                title={`Recusar o pedido`}
                                                onClick={() =>
                                                    addOrderRecused({
                                                        orderId: order.id,
                                                        status: status.recused,
                                                    })
                                                }
                                                style={{
                                                    position: "absolute",
                                                    left: "50%",
                                                    marginLeft: -60,
                                                    bottom: 30,
                                                }}
                                            >
                                                <orderStatus.iconCancel />{" "}
                                                Recusar
                                            </Button>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    ));
}

const Subtitle = styled(Typography).attrs({
    variant: "button",
})`
    font-weight: bold;
`;

export default Orders;
