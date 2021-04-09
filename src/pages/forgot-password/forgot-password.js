import React, { useCallback, useReducer, useState } from "react";
import styled from "styled-components";
import { Button, Grid, Typography } from "@material-ui/core";
import {
    EmailField,
    FirstPagesFormContainer as FormContainer,
    FirstPagesForm as Form,
    H4,
    Container,
} from "ui";
import { useAuth } from "hooks";
import { Link } from "react-router-dom";
import { LOGIN, SINGUP } from "routes";

function ForgotPassword() {
    const { forgoutPassword } = useAuth();
    const [forgotInfo, dispatch] = useReducer(reducer, initialState);
    const [emailNotExists, setEmailNotExists] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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

            const { email } = forgotInfo;

            const result = await forgoutPassword(email);

            setEmailNotExists(result);
            setShowSuccess(!result);
        },
        [forgoutPassword, forgotInfo]
    );

    return (
        <Container>
            <FormContainer>
                <Form onSubmit={handleSubmit}>
                    <Grid item xs={12} style={{ marginTop: 50 }}>
                        <H4>Recuperar conta</H4>
                    </Grid>
                    <EmailField
                        value={forgotInfo.email}
                        onChange={handleChange}
                        error={!!emailNotExists}
                        autoFocus
                    />

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            color="secondary"
                            type="submit"
                        >
                            Recuperar
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        {showSuccess && (
                            <SuccessText>
                                Sucesso! <br />
                                Verifique seu email para redefinir sua senha e
                                depois tente logar novamente{" "}
                                <Link to={LOGIN} variant="body2">
                                    clicando aqui.
                                </Link>
                            </SuccessText>
                        )}
                        {emailNotExists && (
                            <ErrorText>
                                Este email ainda não está cadastrado, tente
                                novamente ou{" "}
                                <Link to={SINGUP} variant="body2">
                                    crie uma conta.
                                </Link>
                            </ErrorText>
                        )}
                    </Grid>
                </Form>
            </FormContainer>
        </Container>
    );
}

const initialState = {
    email: "",
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

const SuccessText = styled(Typography)`
    color: green;
`;

const ErrorText = styled(Typography)`
    color: #f44336;
`;

export default ForgotPassword;
