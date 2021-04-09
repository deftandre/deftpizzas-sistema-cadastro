import React, { lazy, useEffect, useState, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";
import firebase from "services/firebase";
import { useAuth } from "hooks";

import { FORGOT_PASSWORD, HOME, LOGIN, SINGUP } from "routes";

const MainPage = lazy(() => import("pages/main"));
const Login = lazy(() => import("pages/login"));
const SingUp = lazy(() => import("pages/sing-up"));
const ForgotPassword = lazy(() => import("pages/forgot-password"));

function App() {
    const location = useLocation();
    const { userName, userInfo, setUserInfo } = useAuth();
    const [didCheckUserIn, setDidCheckUserIn] = useState(false);

    const { isUserLoggedIn } = userInfo;

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            setUserInfo({
                isUserLoggedIn: !!user,
                user: user && {
                    ...user,
                    displayName: user.displayName || userName,
                    firstName:
                        user.displayName?.split(" ")[0] ||
                        userName.split(" ")[0],
                },
            });
            setDidCheckUserIn(true);
        });
    }, [setUserInfo, userName]);

    if (!didCheckUserIn) {
        return <LinearProgress />;
    }

    if (isUserLoggedIn && location.pathname === LOGIN) {
        return <Redirect to={HOME} />;
    }

    if (isUserLoggedIn && location.pathname === SINGUP) {
        return <Redirect to={HOME} />;
    }

    if (isUserLoggedIn && location.pathname === FORGOT_PASSWORD) {
        return <Redirect to={HOME} />;
    }

    if (
        !isUserLoggedIn &&
        location.pathname !== LOGIN &&
        location.pathname !== SINGUP &&
        location.pathname !== FORGOT_PASSWORD
    ) {
        return <Redirect to={LOGIN} />;
    }

    return (
        <Suspense fallback={<LinearProgress />}>
            <Switch>
                <Route path={LOGIN} component={Login} />
                <Route path={SINGUP} component={SingUp} />
                <Route path={FORGOT_PASSWORD} component={ForgotPassword} />
                <Route path={HOME} component={MainPage} />
            </Switch>
        </Suspense>
    );
}

export default App;
