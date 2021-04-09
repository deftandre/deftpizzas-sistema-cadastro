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
import { DRINKS, NEW, EDIT } from "routes";

import { useCollection } from "hooks";

const TableDrinks = () => {
    const newDrinksPath = useRouteMatch(`${DRINKS}${NEW}`);
    const { data: drinks, remove } = useCollection("drinks");

    return (
        <TableContainer>
            <TableTitleContainer>
                <Grid item>
                    <TableTitle>Bebidas cadastradas</TableTitle>
                </Grid>
                <Grid item>
                    <TableButton
                        color="primary"
                        startIcon={<Add />}
                        component={Link}
                        to={`${DRINKS}${NEW}`}
                        disabled={!!newDrinksPath}
                    >
                        Adicionar nova bebida
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
                    {drinks?.length === 0 && (
                        <TableRow>
                            <TableCell>
                                Não existem bebidas cadastradas.
                            </TableCell>
                        </TableRow>
                    )}
                    {drinks?.map((drink) => (
                        <TableRow key={drink.id}>
                            <TableCell>
                                <img
                                    src={drink.image}
                                    alt={drink.name}
                                    width="50"
                                />
                            </TableCell>
                            <TableCell>{drink.name}</TableCell>
                            <TableCell>R$ {drink.value}</TableCell>
                            <TableCell>
                                <TableButton
                                    startIcon={<Edit />}
                                    component={Link}
                                    to={`${DRINKS}${EDIT(drink.id)}`}
                                >
                                    Editar
                                </TableButton>
                                <TableButton
                                    color="secondary"
                                    startIcon={<Delete />}
                                    onClick={() => remove(drink.id)}
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

export default TableDrinks;
