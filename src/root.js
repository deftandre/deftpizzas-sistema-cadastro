import React from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import {
    CssBaseline,
    createMuiTheme,
    MuiThemeProvider,
} from "@material-ui/core";
import { AuthProvider } from "contexts";
import App from "./app";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    extend: {
        drawerWidth: 280,
    },
    palette: {
        common: {
            white: "#f4f4f4",
            black: "#212121",
        },
        secondary: {
            main: "#ff5722",
        },
    },
});

const Root = () => (
    <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <CssBaseline />
                <GlobalStyle />
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    </MuiThemeProvider>
);

const GlobalStyle = createGlobalStyle`
    #root{
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
`;

export default hot(module)(Root);
