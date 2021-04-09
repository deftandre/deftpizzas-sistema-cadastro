import React from "react";
import { Route } from "react-router-dom";
import TablePizzasFollows from "./table";
import FormRegisterFollows from "./form";
import { PIZZAS_FOLLOWS, NEW, EDIT } from "routes";

const newFollowsPath = `${PIZZAS_FOLLOWS}${NEW}`;
const editFollowsPath = `${PIZZAS_FOLLOWS}${EDIT()}`;

function PizzasFlavours() {
    return (
        <>
            <Route path={[newFollowsPath, editFollowsPath]}>
                <FormRegisterFollows />
            </Route>
            <TablePizzasFollows />
        </>
    );
}

export default PizzasFlavours;
