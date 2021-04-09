import React, {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import { Form, FormContainer, TextField } from "ui";
import { useCollection } from "hooks";
import { PIZZAS_FOLLOWS } from "routes";

const FormRegisterFollow = () => {
    const { id } = useParams();
    const { pizzaFollow, add, edit } = usePizzaFollow(id);
    const [pizzaFollowEditable, dispatch] = useReducer(reducer, initialState);
    const history = useHistory();
    const nameField = useRef();

    const texts = useMemo(
        () => ({
            title: id
                ? "Editar acompanhamento"
                : "Cadastrar novo acompanhamento",
            button: id ? "Salvar" : "Cadastrar",
        }),
        [id]
    );

    useEffect(() => {
        nameField.current.focus();
    }, [id]);

    useEffect(() => {
        dispatch({
            type: "EDIT",
            payload: pizzaFollow,
        });
    }, [pizzaFollow]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        dispatch({
            type: "UPDATE_FIELD",
            payload: {
                [name]: value,
            },
        });
    }, []);

    const handleChangeNumber = useCallback((e) => {
        const { name, value } = e.target;
        dispatch({
            type: "UPDATE_FIELD",
            payload: {
                [name]: value.replace(/\D/g, ""),
            },
        });
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            const { id, ...data } = pizzaFollowEditable;

            const normalizedData = {
                ...data,
                value: +data.value,
            };

            if (id) await edit(id, normalizedData);
            else await add(normalizedData);
            history.push(PIZZAS_FOLLOWS);
        },
        [add, edit, pizzaFollowEditable, history]
    );

    return (
        <FormContainer>
            <Grid item xs={12}>
                <Typography variant="h4">{texts.title}</Typography>
            </Grid>

            <Form onSubmit={handleSubmit}>
                <TextField
                    label="Nome do acompanhamento"
                    name="name"
                    inputRef={nameField}
                    value={pizzaFollowEditable.name}
                    onChange={handleChange}
                />

                <TextField
                    label="Link para imagem desse acompanhamento"
                    name="image"
                    value={pizzaFollowEditable.image}
                    onChange={handleChange}
                />

                <TextField
                    label="Valor em R$: "
                    name="value"
                    value={pizzaFollowEditable.value}
                    onChange={handleChangeNumber}
                />

                <Grid item container justify="flex-end" spacing={2}>
                    <Grid item>
                        <Button
                            variant="contained"
                            component={Link}
                            to={PIZZAS_FOLLOWS}
                        >
                            Cancelar
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            {texts.button}
                        </Button>
                    </Grid>
                </Grid>
            </Form>
        </FormContainer>
    );
};

const initialState = {
    name: "",
    image: "",
    value: "",
};

function reducer(state, action) {
    if (action.type === "EDIT") {
        return action.payload;
    }

    if (action.type === "UPDATE_FIELD") {
        return {
            ...state,
            ...action.payload,
        };
    }

    return state;
}

function usePizzaFollow(id) {
    const { data, add, edit } = useCollection("pizzasFollows");
    const [pizzaFollow, setPizzaFollow] = useState(initialState);

    useEffect(() => {
        setPizzaFollow(data?.find((p) => p.id === id) || initialState);
    }, [data, id]);

    return { pizzaFollow, add, edit };
}

export default FormRegisterFollow;
