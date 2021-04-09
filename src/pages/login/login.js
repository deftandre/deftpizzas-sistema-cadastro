import React, { useCallback, useReducer } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button, Grid, Grid as MaterialGrid } from "@material-ui/core";
import {
    FacebookLoginButton,
    GoogleLoginButton,
} from "react-social-login-buttons";
import {
    EmailField,
    FirstPagesFormContainer as FormContainer,
    FirstPagesForm as Form,
    PasswordField,
    Container,
} from "ui";
import { useAuth } from "hooks";
import MainLogo from "images/squad-logo-black-deft-PIZZAS-2.png";
import { FORGOT_PASSWORD, SINGUP } from "routes";

function Login() {
    const { login, facebookLogin, googleLogin } = useAuth();
    const [loginInfo, dispatch] = useReducer(reducer, initialState);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        dispatch({
            type: "UPDATE_FIELD",
            payload: {
                [name]: value,
            },
        });
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            const { email, password } = loginInfo;

            await login(email, password);
        },
        [login, loginInfo]
    );

    return (
        <Container>
            <FormContainer>
                <Grid item>
                    <Logo />
                </Grid>
                <Form onSubmit={handleSubmit}>
                    <EmailField
                        value={loginInfo.email}
                        onChange={handleChange}
                        autoFocus
                    />
                    <PasswordField
                        value={loginInfo.password}
                        onChange={handleChange}
                    />

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            color="secondary"
                            style={{ marginTop: 10 }}
                            type="submit"
                        >
                            Logar
                        </Button>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={12} sm={6}>
                            <Link to={FORGOT_PASSWORD} variant="body2">
                                Esqueceu sua senha?
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Link to={SINGUP} variant="body2">
                                Novo por aqui? Crie sua conta
                            </Link>
                        </Grid>
                    </Grid>
                </Form>

                <GridButtonContainer>
                    <Grid item xs={12} sm={6}>
                        <FacebookLoginButton onClick={facebookLogin}>
                            <span style={{ fontSize: 14 }}>
                                Entrar com Facebook
                            </span>
                        </FacebookLoginButton>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <GoogleLoginButton onClick={googleLogin}>
                            <span style={{ fontSize: 14 }}>
                                Entrar com Google
                            </span>
                        </GoogleLoginButton>
                    </Grid>
                </GridButtonContainer>
            </FormContainer>
        </Container>
    );
}

const initialState = {
    email: "",
    password: "",
};

function reducer(state, action) {
    if (action.type === "UPDATE_FIELD") {
        return {
            ...state,
            ...action.payload,
        };
    }

    return state;
}

const Logo = styled.img.attrs({
    src: MainLogo,
    alt: "Deft Pizzas Delivery",
})`
    width: 100%;
    max-width: 200px;
`;

const GridButtonContainer = styled(MaterialGrid).attrs({
    item: true,
    xs: 12,
    container: true,
    justify: "center",
})`
    min-width: 280px;
    max-width: 420px;
`;

export default Login;
