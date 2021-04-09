import styled from "styled-components";
import { Grid } from "@material-ui/core";

export const FirstPagesForm = styled(Grid).attrs({
    item: true,
    container: true,
    xs: 12,
    spacing: 1,
    component: "form",
})`
    width: 100%;
    max-width: 420px;
    max-height: 400px;
`;

export const FirstPagesFormContainer = styled(Grid).attrs({
    container: true,
    spacing: 2,
    justify: "center",
})`
    min-height: 600px;
    max-height: 600px;
    min-width: 300px;
    max-width: 480px;
    background-color: #eeeeee;
    border-radius: 4px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;
