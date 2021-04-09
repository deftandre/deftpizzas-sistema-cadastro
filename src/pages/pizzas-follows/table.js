import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { Grid, Table, TableBody, TableRow, TableCell } from "@material-ui/core";
import { Add, Delete, Edit } from "@material-ui/icons";
import {
    TableButton,
    TableContainer,
    TableTitle,
    TableTitleContainer,
    Th,
    THead,
} from "ui";
import { PIZZAS_FOLLOWS, NEW, EDIT } from "routes";

import { useCollection } from "hooks";

const TablePizzasFollows = () => {
    const newFollowsPath = useRouteMatch(`${PIZZAS_FOLLOWS}${NEW}`);
    const { data: pizzasFollows, remove } = useCollection("pizzasFollows");

    return (
        <TableContainer>
            <TableTitleContainer>
                <Grid item>
                    <TableTitle>Acompanhamentos cadastrados</TableTitle>
                </Grid>
                <Grid item>
                    <TableButton
                        color="primary"
                        startIcon={<Add />}
                        component={Link}
                        to={`${PIZZAS_FOLLOWS}${NEW}`}
                        disabled={!!newFollowsPath}
                    >
                        Adicionar novo acompanhamento
                    </TableButton>
                </Grid>
            </TableTitleContainer>
            <Table>
                <THead>
                    <TableRow>
                        <Th>Foto</Th>
                        <Th>Nome</Th>
                        <Th>Valor</Th>
                        <Th></Th>
                    </TableRow>
                </THead>
                <TableBody>
                    {pizzasFollows?.length === 0 && (
                        <TableRow>
                            <TableCell>
                                Não existem acompanhamentos cadastrados.
                            </TableCell>
                        </TableRow>
                    )}
                    {pizzasFollows?.map((follow) => (
                        <TableRow key={follow.id}>
                            <TableCell>
                                <img
                                    src={follow.image}
                                    alt={follow.name}
                                    width="50"
                                />
                            </TableCell>
                            <TableCell>{follow.name}</TableCell>
                            <TableCell>R$ {follow.value}</TableCell>
                            <TableCell>
                                <TableButton
                                    startIcon={<Edit />}
                                    component={Link}
                                    to={`${PIZZAS_FOLLOWS}${EDIT(follow.id)}`}
                                >
                                    Editar
                                </TableButton>
                                <TableButton
                                    color="secondary"
                                    startIcon={<Delete />}
                                    onClick={() => remove(follow.id)}
                                >
                                    Remover
                                </TableButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TablePizzasFollows;
