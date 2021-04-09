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
import { DRINKS } from "routes";

const FormRegisterDrink = () => {
    const { id } = useParams();
    const { drink, add, edit } = useDrink(id);
    const [drinkEditable, dispatch] = useReducer(reducer, initialState);
    const history = useHistory();
    const nameField = useRef();

    const texts = useMemo(
        () => ({
            title: id ? "Editar bebida" : "Cadastrar nova bebida",
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
            payload: drink,
        });
    }, [drink]);

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

            const { id, ...data } = drinkEditable;

            const normalizedData = {
                ...data,
                value: +data.value,
            };

            if (id) await edit(id, normalizedData);
            else await add(normalizedData);
            history.push(DRINKS);
        },
        [add, edit, drinkEditable, history]
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
                    value={drinkEditable.name}
                    onChange={handleChange}
                />

                <TextField
                    label="Link para imagem desse acompanhamento"
                    name="image"
                    value={drinkEditable.image}
                    onChange={handleChange}
                />

                <TextField
                    label="Valor em R$: "
                    name="value"
                    value={drinkEditable.value}
                    onChange={handleChangeNumber}
                />

                <Grid item container justify="flex-end" spacing={2}>
                    <Grid item>
                        <Button
                            variant="contained"
                            component={Link}
                            to={DRINKS}
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

function useDrink(id) {
    const { data, add, edit } = useCollection("drinks");
    const [drink, setdrink] = useState(initialState);

    useEffect(() => {
        setdrink(data?.find((p) => p.id === id) || initialState);
    }, [data, id]);

    return { drink, add, edit };
}

export default FormRegisterDrink;
