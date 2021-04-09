import React from "react";
import { Route } from "react-router-dom";
import TablePizzasDrinks from "./table";
import FormRegisterDrinks from "./form";
import { DRINKS, NEW, EDIT } from "routes";

const newDrinksPath = `${DRINKS}${NEW}`;
const editDrinksPath = `${DRINKS}${EDIT()}`;

function Drinks() {
    return (
        <>
            <Route path={[newDrinksPath, editDrinksPath]}>
                <FormRegisterDrinks />
            </Route>
            <TablePizzasDrinks />
        </>
    );
}

export default Drinks;
