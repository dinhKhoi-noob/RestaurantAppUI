import {
    Box,
    Button,
    FormControl,
    FormLabel,
    ImageList,
    ImageListItem,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import React, { SyntheticEvent, useContext, useEffect } from "react";
import { CategoryContext } from "../../contexts/CategoryContext";
import { DishContext } from "../../contexts/DishContext";
import { UploadFileContext } from "../../contexts/UploadFileContext";
import Image from "next/image";
import { RiImageAddFill } from "react-icons/ri";
import { LayoutContext } from "../../contexts/LayoutContext";
type DishInputType = "title" | "price" | "description";

const DishModal = () => {
    const {
        isOpenedModal,
        submitType,
        dishInput,
        changeOpenModalStatus,
        changeSubmitType,
        resetField,
        changeDishInputValue,
    } = useContext(DishContext);
    const { renderCategorySelector } = useContext(CategoryContext);
    const { fileNames, currentFilePaths, changeFilesArray, changeCurrentFilePaths } = useContext(UploadFileContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    const { categoryId, price, title, description } = dishInput;

    useEffect(() => {
        if (!fileNames || fileNames?.length === 0) {
            changeFilesArray(undefined);
            return;
        }
        const imageFiles = Array.prototype.slice.call(fileNames);
        const temporaryFilePaths = imageFiles.map((item: File) => {
            const objectURL = URL.createObjectURL(item);
            return objectURL;
        });
        changeCurrentFilePaths(temporaryFilePaths);
        return () => {
            currentFilePaths.forEach((item: string) => {
                URL.revokeObjectURL(item);
            });
            changeCurrentFilePaths([]);
        };
    }, [fileNames]);

    const handleOnChangeInput = (event: SyntheticEvent, type: DishInputType) => {
        const target = event.target as HTMLInputElement;
        switch (type) {
            case "price":
                changeDishInputValue({
                    ...dishInput,
                    price: isNaN(parseInt(target.value)) ? 0 : parseInt(target.value),
                });
                break;
            case "title":
                changeDishInputValue({
                    ...dishInput,
                    title: target.value,
                });
                break;
            case "description":
                changeDishInputValue({
                    ...dishInput,
                    description: target.value,
                });
                break;
            default:
                break;
        }
    };

    const handleChooseCategory = (event: SelectChangeEvent) => {
        const value = event.target.value;
        if (value === "select") {
            return;
        }
        changeDishInputValue({ ...dishInput, categoryId: value });
    };

    const handleChangeImages = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files) {
            changeFilesArray(files);
        }
    };

    const renderImageReview = () => {
        if (currentFilePaths.length > 0) {
            return (
                <>
                    <ImageList>
                        {currentFilePaths.map((imageSrc: string, index) => {
                            return (
                                <ImageListItem key={index}>
                                    <Image src={`${imageSrc}`} width="164px" height="164px" />
                                </ImageListItem>
                            );
                        })}
                    </ImageList>
                    <Box mt={2} mb={2} />
                    <input
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        id="raised-button-file"
                        type="file"
                        onChange={event => {
                            handleChangeImages(event);
                        }}
                    />
                    <Button variant="contained" color="warning">
                        <label htmlFor="raised-button-file">Choose other pictures</label>
                    </Button>
                </>
            );
        } else {
            return (
                <>
                    <input
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        id="raised-button-file"
                        type="file"
                        onChange={event => {
                            handleChangeImages(event);
                        }}
                    />
                    <label htmlFor="raised-button-file">
                        <Box
                            width="100%"
                            height="300px"
                            display="flex"
                            p={3}
                            flexDirection="column"
                            justifyContent="space-around"
                            alignItems="center"
                            border="1.5px dotted"
                        >
                            <RiImageAddFill fontSize={100} opacity={0.4} />
                        </Box>
                    </label>
                </>
            );
        }
    };

    const handleSubmitDishModal = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            isToggle: true,
            title: "Do you want to create a dish with these information ?",
            type: "createDish",
        });
    };

    const handleSubmitEdittingModal = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            isToggle: true,
            title: "Do you want to update this dish with these information ?",
            type: "updateDish",
        });
    };

    return (
        <Modal
            open={isOpenedModal}
            onClose={() => {
                changeOpenModalStatus(false);
                resetField();
                changeSubmitType("create");
                changeCurrentFilePaths([]);
                changeFilesArray(undefined);
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <Box className="small-modal scrollable" p={4} pr={2} pl={2}>
                <Typography mt={4} mb={4} variant="h6">
                    Add new dish
                </Typography>
                <form
                    onSubmit={event => {
                        submitType === "create" ? handleSubmitDishModal(event) : handleSubmitEdittingModal(event);
                    }}
                >
                    <FormControl fullWidth>
                        <FormLabel id="select-root-id">Select category</FormLabel>
                        <Box mt={1} mb={1} />
                        <Select
                            aria-labelledby="select-root-id"
                            value={categoryId}
                            onChange={handleChooseCategory}
                            defaultValue="select"
                        >
                            <MenuItem value="select">-- Choose category ---</MenuItem>
                            {renderCategorySelector()}
                        </Select>
                    </FormControl>
                    <Box mt={2} mb={2}></Box>
                    <FormControl fullWidth>
                        <FormLabel id="input-category-title">Title</FormLabel>
                        <Box mt={1} mb={1} />
                        <TextField
                            value={title}
                            placeholder="Title"
                            helperText="Title must not be empty"
                            onChange={event => {
                                handleOnChangeInput(event, "title");
                            }}
                        />
                    </FormControl>
                    <Box mt={2} mb={2}></Box>
                    <FormControl fullWidth>
                        <FormLabel id="input-category-price">Price (VND)</FormLabel>
                        <Box mt={1} mb={1} />
                        <TextField
                            value={price}
                            type="number"
                            placeholder="Price"
                            helperText="Price must greater than 0"
                            onChange={event => {
                                handleOnChangeInput(event, "price");
                            }}
                        />
                    </FormControl>
                    <Box mt={2} mb={2}></Box>
                    <FormControl fullWidth>
                        <FormLabel id="input-category-description">Description</FormLabel>
                        <Box mt={1} mb={1} />
                        <TextField
                            placeholder="Type some thing..."
                            multiline
                            value={description}
                            rows={4}
                            onChange={event => {
                                handleOnChangeInput(event, "description");
                            }}
                            helperText="Enter description to customer can know more about this dish"
                        />
                    </FormControl>
                    <Box mt={2} mb={2}></Box>
                    <FormLabel>Choose dish pictures</FormLabel>
                    <Box mt={1} mb={1} />
                    {renderImageReview()}
                    <Box mt={3} mb={3} />
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={event => {
                                submitType === "create"
                                    ? handleSubmitDishModal(event)
                                    : handleSubmitEdittingModal(event);
                            }}
                        >
                            {submitType === "create" ? "Create" : "Update"}
                        </Button>
                        &nbsp;
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                changeOpenModalStatus(false);
                                resetField();
                                changeSubmitType("create");
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default DishModal;
