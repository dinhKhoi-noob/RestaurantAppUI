import {
    Box,
    Button,
    Chip,
    FormControl,
    FormLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import React, { ReactElement, ReactNode, SyntheticEvent, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import { LayoutContext, OrderConfirmationType } from "../../contexts/LayoutContext";
type OverwritingColorType = "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined;
interface CheckoutFormProps {
    addressString: string;
    isManageable: boolean;
    isEditable: boolean;
    isConfirmed: boolean;
    role: string;
    step: string;
}

const CheckoutForm = ({ isManageable, isEditable, isConfirmed, role, step, addressString }: CheckoutFormProps) => {
    const { renderTransactionAddressSelector } = useContext(AuthContext);
    const { changeOpenAddressModalStatus, changeConfirmationModalValues } = useContext(LayoutContext);
    const { checkoutInput, changeCheckoutInputValue } = useContext(CartContext);
    const { address, name, phone } = checkoutInput;
    const selectTransactionAddress = (event: SelectChangeEvent) => {
        changeCheckoutInputValue({ ...checkoutInput, address: event.target.value });
    };

    const changeInputCheckout = (event: SyntheticEvent, type: "name" | "phone") => {
        const target = event.target as HTMLInputElement;
        if (type === "name") {
            changeCheckoutInputValue({ ...checkoutInput, name: target.value });
            return;
        }
        changeCheckoutInputValue({ ...checkoutInput, phone: target.value });
    };

    const handleSubmitCheckoutForm = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            type: "createOrder",
            isToggle: true,
            title: "Do you really want to create a new order with these information ?",
        });
    };

    const handleUpdateCheckout = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            type: "updateOrder",
            isToggle: true,
            title: "Do you really want to update this order with these information ?",
        });
    };

    const handleManagementFunction = (type: OrderConfirmationType) => {
        let content = "Confirm this order?";
        switch (type) {
            case "changeToReady":
                content = "Complete this order preparation?";
                break;
            case "changeToDelivering":
                content = "Deliver this order?";
                break;
            case "changeToDeliveried":
                content = "Complete this order delivering?";
                break;
            case "changeToConfirmed":
                content = "Confirm this order?";
                break;
            case "cancelOrder":
                content = "Cancel this order?";
                break;
            default:
                break;
        }
        changeConfirmationModalValues({
            title: content,
            type,
            isToggle: true,
        });
    };

    const renderManagementButton = (role: string, currentStep: string, isConfirmed: boolean): ReactNode => {
        if (role === "manager" && currentStep === "progress" && !isConfirmed) {
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        handleManagementFunction("confirmOrder");
                    }}
                >
                    Confirm this order
                </Button>
            );
        }
        if (role === "manager" && currentStep === "progress" && isConfirmed) {
            return (
                <Button variant="contained" color="secondary" onClick={() => handleManagementFunction("changeToReady")}>
                    Complete preparation
                </Button>
            );
        }
        if (role === "shipper" && currentStep === "ready") {
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        handleManagementFunction("changeToDelivering");
                    }}
                >
                    Deliver this order
                </Button>
            );
        }
        if (role === "shipper" && currentStep === "delivering") {
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        handleManagementFunction("changeToDeliveried");
                    }}
                >
                    Complete delivering order
                </Button>
            );
        }
        if (role === "customer" && currentStep === "deliveried") {
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleManagementFunction("changeToConfirmed")}
                >
                    Confirm this order
                </Button>
            );
        }
    };

    const convertOrderStatus = (status: string, isConfirmed: boolean): ReactElement => {
        let color: OverwritingColorType = "warning";
        console.log(status, isConfirmed);
        if (status === "progress" && !isConfirmed) {
            status = "unconfirmed";
        }
        switch (status) {
            case "unconfirmed":
                color = "default";
                break;
            case "cancel":
                color = "error";
                break;
            case "ready":
                color = "info";
                break;
            case "delivering":
                color = "primary";
                break;
            case "deliveried":
                color = "secondary";
                break;
            case "confirmed":
                color = "success";
                break;
            default:
                color = "warning";
        }
        return <Chip label={status} color={color} />;
    };

    return (
        <>
            <Typography variant="h5">Shipping information</Typography>
            <form
                onSubmit={event => {
                    isManageable ? handleUpdateCheckout(event) : handleSubmitCheckoutForm(event);
                }}
            >
                <Box p={5}>
                    {isEditable && step !== "process" && !isConfirmed ? (
                        <>
                            <FormControl fullWidth>
                                <FormLabel>Full name</FormLabel>
                                <TextField
                                    disabled={!isEditable}
                                    value={name}
                                    onChange={event => changeInputCheckout(event, "name")}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <FormLabel>Phone</FormLabel>
                                <TextField
                                    disabled={!isEditable}
                                    value={phone}
                                    onChange={event => changeInputCheckout(event, "phone")}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <FormLabel>Select address</FormLabel>
                                <Select
                                    disabled={!isEditable}
                                    labelId="address-selector"
                                    id="address-selector-select"
                                    value={address}
                                    defaultValue="select"
                                    onChange={event => {
                                        selectTransactionAddress(event);
                                    }}
                                >
                                    <MenuItem value="select">-- Chọn địa chỉ --</MenuItem>
                                    {renderTransactionAddressSelector()}
                                </Select>
                            </FormControl>
                            <Box mt={2} />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    changeOpenAddressModalStatus();
                                }}
                            >
                                Add new address
                            </Button>
                            <Box mt={5} />
                            {isManageable ? (
                                <Box display="flex">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        fullWidth
                                        type="submit"
                                        onClick={event => {
                                            handleUpdateCheckout(event);
                                        }}
                                    >
                                        Update order
                                    </Button>
                                    &nbsp;
                                    <Button
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        onClick={() => {
                                            handleManagementFunction("cancelOrder");
                                        }}
                                    >
                                        Cancel order
                                    </Button>
                                </Box>
                            ) : (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    onClick={event => {
                                        handleSubmitCheckoutForm(event);
                                    }}
                                >
                                    Create order
                                </Button>
                            )}
                        </>
                    ) : (
                        <>
                            <Box mt={2} />
                            <Box display="flex" justifyContent="space-between">
                                <Box mt={2} mb={2} width="30%">
                                    <Typography fontWeight="bold">Full name:</Typography>
                                    <Box mt={1} />
                                    <Typography fontWeight="bold">Phone:</Typography>
                                    <Box mt={1} />
                                    <Typography fontWeight="bold">Address:</Typography>
                                    <Box mt={1} />
                                    <Typography fontWeight="bold">Status:</Typography>
                                </Box>
                                <Box mt={2} mb={2} width="70%">
                                    <Typography>{name}</Typography>
                                    <Box mt={1} />
                                    <Typography>{phone}</Typography>
                                    <Box mt={1} />
                                    <Typography>{addressString?.split("!^!")[0]}</Typography>
                                    <Box mt={1} />
                                    {convertOrderStatus(step, isConfirmed)}
                                </Box>
                            </Box>
                            <Box mt={2} display="flex" justifyContent="flex-end">
                                {renderManagementButton(role, step, isConfirmed)}
                            </Box>
                        </>
                    )}
                </Box>
            </form>
        </>
    );
};

export default CheckoutForm;
