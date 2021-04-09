import React, { lazy, Suspense, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import {
    Divider,
    Drawer as MaterialDrawer,
    List,
    ListItem,
    ListItemText,
    LinearProgress,
    Typography,
    IconButton,
} from "@material-ui/core";

import * as routes from "routes";
import { useAuth } from "hooks";
import { ExitToApp } from "@material-ui/icons";
import Logo from "./logo";

const Orders = lazy(() => import("pages/orders"));
const PizzasSizes = lazy(() => import("pages/pizzas-sizes"));
const PizzasFlavours = lazy(() => import("pages/pizzas-flavours"));
const PizzasFollows = lazy(() => import("pages/pizzas-follows"));
const Drinks = lazy(() => import("pages/drinks"));
const Analytics = lazy(() => import("pages/analytics"));

const Main = () => {
    const { logout } = useAuth();

    useScrollToTop();
    const { pathname } = useLocation();

    const getSelectedMenuItem = useCallback(
        (item) => {
            return (
                pathname === item.link ||
                (pathname.includes(item.link) && item.link !== routes.HOME)
            );
        },
        [pathname]
    );

    return (
        <>
            <Drawer variant="permanent">
                <ContentContainer>
                    <DrawerContent>
                        <Logo />
                        <Typography>(sistema de cadastro)</Typography>
                    </DrawerContent>
                    <Divider />
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                key={item.label}
                                button
                                selected={getSelectedMenuItem(item)}
                                component={Link}
                                to={item.link}
                            >
                                <ListItemText>{item.label}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </ContentContainer>
                <IconButton color="inherit" onClick={logout}>
                    <ExitToApp />
                    Sair
                </IconButton>
            </Drawer>

            <Content>
                <Suspense fallback={<LinearProgress />}>
                    <Switch>
                        {menuItems.map((item) => (
                            <Route
                                key={item.link}
                                path={item.link}
                                exact={item.exact}
                            >
                                <item.component />
                            </Route>
                        ))}
                    </Switch>
                </Suspense>
            </Content>
        </>
    );
};

function useScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
}

const menuItems = [
    {
        label: "Pedidos",
        link: routes.HOME,
        component: Orders,
        exact: true,
    },
    {
        label: "Tamanhos de pizzas",
        link: routes.PIZZAS_SIZES,
        component: PizzasSizes,
    },
    {
        label: "Sabores de pizzas",
        link: routes.PIZZAS_FLAVOURS,
        component: PizzasFlavours,
    },
    {
        label: "Acompanhamentos",
        link: routes.PIZZAS_FOLLOWS,
        component: PizzasFollows,
    },
    {
        label: "Bebidas",
        link: routes.DRINKS,
        component: Drinks,
    },
    {
        label: "Análise de vendas",
        link: routes.ANALYTICS,
        component: Analytics,
    },
];

const Drawer = styled(MaterialDrawer)`
    .MuiPaper-root {
        width: ${({ theme }) => theme.extend.drawerWidth}px;
    }
`;

const ContentContainer = styled.div`
    flex-grow: 1;
`;

const DrawerContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing(1)}px;
    align-items: center;
    text-align: center;
`;

const Content = styled.main`
    margin-left: ${({ theme }) => theme.extend.drawerWidth}px;
    padding: ${({ theme }) => theme.spacing(3)}px;
`;

export default Main;
