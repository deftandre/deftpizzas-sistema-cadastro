import React from "react";
import TextField from "./text-field";

const EmailField = ({ ...props }) => {
    return (
        <TextField
            label="Email"
            name="email"
            autoComplete="email"
            required
            {...props}
        />
    );
};

export default EmailField;
