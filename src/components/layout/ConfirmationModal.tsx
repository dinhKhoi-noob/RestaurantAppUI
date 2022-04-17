import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import React, { SyntheticEvent, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import { CategoryContext } from "../../contexts/CategoryContext";
import { DishContext } from "../../contexts/DishContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import { OrderContext } from "../../contexts/OrderContext";
import { UploadFileContext } from "../../contexts/UploadFileContext";

const ConfirmationModal = () => {
    const {
        confirmationModalValue,
        changeLoadingStatus,
        changeSnackbarValues,
        changeConfirmationModalValues,
        changeOpenAddressModalStatus,
    } = useContext(LayoutContext);
    const { userInfo, userAddress, loggoutUser, addNewAddress } = useContext(AuthContext);
    const { postCategory, changeCategoryStatus, updateCategory } = useContext(CategoryContext);
    const { createNewDish, updateDishInformation, changeDishStatus, postNewRating } = useContext(DishContext);
    const { fileNames, changeCurrentFilePaths, uploadMultipleFiles } = useContext(UploadFileContext);
    const { createCheckout } = useContext(CartContext);
    const { updateOrder, changeStatusOrder, confirmOrder } = useContext(OrderContext);
    const { isToggle, type, title } = confirmationModalValue;
    const handleDeclineBtn = () => {
        changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
    };

    const handleAddNewAddress = (id: string) => {
        changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
        if (userAddress) {
            const { city, district, ward, street, level, cityCode, districtCode, wardCode } = userAddress;
            const address =
                level +
                ", " +
                street +
                ", " +
                ward +
                ", " +
                district +
                ", " +
                city +
                "!^!" +
                cityCode +
                "&" +
                districtCode +
                "&" +
                wardCode;
            addNewAddress(address, id);
            changeOpenAddressModalStatus();
        }
    };

    const handleCreateNewDish = async () => {
        changeLoadingStatus(true);
        if (fileNames && fileNames.length > 0) {
            const form = new FormData();
            const files = Array.prototype.slice.call(fileNames);
            changeCurrentFilePaths([]);
            files.forEach((file: File) => {
                form.append("data", file, file.name);
            });
            const response = await uploadMultipleFiles(form);
            if (response) {
                createNewDish(response);
            }
        } else {
            changeSnackbarValues({
                isToggle: true,
                type: "error",
                content: "Please choose at least one image",
            });
        }
    };

    const handleUpdateDish = async () => {
        changeLoadingStatus(true);
        if (fileNames && fileNames.length > 0) {
            const form = new FormData();
            const files = Array.prototype.slice.call(fileNames);
            changeCurrentFilePaths([]);
            files.forEach((file: File) => {
                form.append("data", file, file.name);
            });
            const response = await uploadMultipleFiles(form);
            if (response) {
                updateDishInformation(response);
            }
            return;
        }
        updateDishInformation();
    };

    const handleAcceptBtn = async (event: SyntheticEvent) => {
        event.preventDefault();
        const { id } = userInfo;
        changeConfirmationModalValues({ ...confirmationModalValue, isToggle: false });
        switch (type) {
            case "loggout":
                loggoutUser();
                break;
            case "createCategory":
                postCategory();
                break;
            case "updateCategory":
                updateCategory();
                break;
            case "hideCategory":
                changeCategoryStatus(true);
                break;
            case "unhideCategory":
                changeCategoryStatus(false);
                break;
            case "createDish":
                handleCreateNewDish();
                break;
            case "updateDish":
                handleUpdateDish();
                break;
            case "hideDish":
                changeDishStatus(true);
                break;
            case "unhideDish":
                changeDishStatus(false);
                break;
            case "leaveComment":
                postNewRating(id);
                break;
            case "addNewAddress":
                handleAddNewAddress(id);
                break;
            case "createOrder":
                createCheckout(id);
                break;
            case "updateOrder":
                updateOrder();
                break;
            case "confirmOrder":
                confirmOrder(true);
                break;
            case "changeToReady":
                changeStatusOrder("ready");
                break;
            case "changeToDelivering":
                changeStatusOrder("delivering");
                break;
            case "changeToDeliveried":
                changeStatusOrder("deliveried");
                break;
            case "changeToConfirmed":
                changeStatusOrder("confirmed");
                break;
            case "cancelOrder":
                confirmOrder(false);
                break;
            default:
                break;
        }
    };
    return (
        <Modal
            open={isToggle}
            onClose={() => {
                changeConfirmationModalValues({
                    ...confirmationModalValue,
                    isToggle: false,
                });
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <Box className="small-modal" padding={4} paddingRight={3} paddingLeft={3}>
                <form
                    onSubmit={event => {
                        handleAcceptBtn(event);
                    }}
                >
                    <Typography>{title}</Typography>
                    <Box mt={4} mb={4}></Box>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                onClick={event => {
                                    handleAcceptBtn(event);
                                }}
                            >
                                Confirm
                            </Button>
                            &nbsp;
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    handleDeclineBtn();
                                }}
                            >
                                Decline
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default ConfirmationModal;
