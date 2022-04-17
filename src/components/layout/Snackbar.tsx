/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Alert, Snackbar, SnackbarOrigin } from "@mui/material";
import { LayoutContext, SnackbarProps, SnackbarType } from "../../contexts/LayoutContext";
import { useRouter } from "next/router";

const Toast = (props: SnackbarProps) => {
    const { snackbarValues, snackbarPosition, changeSnackbarStatus } = useContext(LayoutContext);
    const { isToggle } = snackbarValues;
    useEffect(() => {
        if (isToggle) {
            setTimeout(() => {
                changeSnackbarStatus(false);
            }, 3000);
        }
    }, [snackbarValues]);
    const { type, content } = props;
    return (
        <Snackbar open={isToggle} anchorOrigin={snackbarPosition}>
            <Alert severity={type} color={type}>
                {content}
            </Alert>
        </Snackbar>
    );
};

export default Toast;
