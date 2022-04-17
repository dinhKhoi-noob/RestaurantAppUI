import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Modal,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import React, { ChangeEvent, SyntheticEvent, useContext } from "react";
import { CategoryContext } from "../../contexts/CategoryContext";
import { LayoutContext } from "../../contexts/LayoutContext";

const CategoryModal = () => {
    const {
        isOpenedModal,
        categoryInput,
        submitType,
        changeSubmitType,
        changeOpenModalStatus,
        resetField,
        renderRootCategorySelector,
        changeCategoryInput,
    } = useContext(CategoryContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    const { rootId, title, type } = categoryInput;

    const handleChangeCategoryType = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        changeCategoryInput({ ...categoryInput, type: value === "root" ? "root" : "component" });
    };

    const handleChooseRootCategory = (event: SelectChangeEvent) => {
        const value = event.target.value;
        if (value === "select") {
            return;
        }
        changeCategoryInput({ ...categoryInput, rootId: value });
    };

    const handleOnChangeTitle = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        changeCategoryInput({ ...categoryInput, title: target.value });
    };

    const handleSubmitCategoryModal = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            isToggle: true,
            type: "createCategory",
            title: "Do you really want to create a category with these information ?",
        });
    };

    const handleSubmitEdittingModal = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            isToggle: true,
            type: "updateCategory",
            title: "Do you really want to update this category with these information ?",
        });
    };

    return (
        <Modal
            open={isOpenedModal}
            onClose={() => {
                changeOpenModalStatus(false);
                resetField();
                changeSubmitType("create");
            }}
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
        >
            <Box className="small-modal" p={4} pr={2} pl={2}>
                <form
                    onSubmit={event => {
                        submitType === "create" ? handleSubmitCategoryModal(event) : handleSubmitEdittingModal(event);
                    }}
                >
                    <Typography variant="h6" mb={4}>
                        {submitType === "create" ? "Add new category" : "Edit category information"}
                    </Typography>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Kind of category</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="root"
                            value={type}
                            onChange={event => handleChangeCategoryType(event)}
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="root" control={<Radio />} label="New kind of category" />
                            <FormControlLabel value="component" control={<Radio />} label="Existed kind of category" />
                        </RadioGroup>
                    </FormControl>
                    <Box mt={2} mb={2} />
                    {type === "component" ? (
                        <FormControl fullWidth>
                            <FormLabel id="select-root-id">Select root category</FormLabel>
                            <Select
                                aria-labelledby="select-root-id"
                                value={rootId}
                                onChange={handleChooseRootCategory}
                                defaultValue="select"
                            >
                                <MenuItem value="select">-- Choose category ---</MenuItem>
                                {renderRootCategorySelector()}
                            </Select>
                        </FormControl>
                    ) : (
                        <></>
                    )}
                    <FormControl>
                        <FormLabel id="input-category-title">Title</FormLabel>
                        <TextField
                            value={title}
                            placeholder="Title"
                            helperText="Title must not be empty"
                            onChange={event => {
                                handleOnChangeTitle(event);
                            }}
                        />
                    </FormControl>
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={event => {
                                submitType === "create"
                                    ? handleSubmitCategoryModal(event)
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

export default CategoryModal;
