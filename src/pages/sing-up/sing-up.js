import React, { useCallback, useReducer } from "react";
import { Button, Grid } from "@material-ui/core";
import {
    EmailField,
    FirstPagesFormContainer as FormContainer,
    FirstPagesForm as Form,
    TextField,
    H4,
    PasswordField,
    Container,
} from "ui";
import { useAuth } from "hooks";

function SingUp() {
    const { createAccount } = useAuth();
    const [singUpInfo, dispatch] = useReducer(reducer, initialState);

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

            const { displayName, email, password } = singUpInfo;

            await createAccount(displayName, email, password);
        },
        [createAccount, singUpInfo]
    );

    return (
        <Container>
            <FormContainer>
                <Form onSubmit={handleSubmit}>
                    <Grid item xs={12} style={{ marginTop: 20 }}>
                        <H4>Criar conta</H4>
                    </Grid>
                    <TextField
                        label="Nome Completo"
                        name="displayName"
                        value={singUpInfo.displayName}
                        onChange={handleChange}
                        input
                        required
                        inputProps={{ maxLength: 60 }}
                        autoFocus
                    />
                    <EmailField
                        value={singUpInfo.email}
                        onChange={handleChange}
                        inputProps={{ maxLength: 120 }}
                    />
                    <PasswordField
                        value={singUpInfo.password}
                        onChange={handleChange}
                        inputProps={{ maxLength: 40 }}
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
                            Criar
                        </Button>
                    </Grid>
                </Form>
            </FormContainer>
        </Container>
    );
}

const initialState = {
    displayName: "",
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

export default SingUp;
