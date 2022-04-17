/* eslint-disable camelcase */
import { Box, MenuItem, Typography } from "@mui/material";
import axios from "axios";
import React, { createContext, ReactNode, useContext, useReducer, useState } from "react";
import { categoryReducer, CategoryReducerState } from "../reducer/categoryReducer";
import { LayoutContext } from "./LayoutContext";

type CategoryType = "root" | "component";
type CategorySubmitType = "create" | "edit";
interface CategoryContextProps {
    children: ReactNode;
}

export interface CategoryValueInitializer {
    id: string;
    rootId: string;
    title: string;
    rootTitle: string;
    isActive: boolean;
}

export interface CategoryInputValue {
    type: CategoryType;
    rootId: string;
    title: string;
}

interface CategoryContextValue {
    categories: CategoryValueInitializer[];
    isOpenedModal: boolean;
    categoryInput: CategoryInputValue;
    submitType: CategorySubmitType;
    changeCurrentCategoryId: (id: string) => void;
    loadAllCategories: () => void;
    changeOpenModalStatus: (status?: boolean) => void;
    resetField: () => void;
    changeCategoryInput: (category: CategoryInputValue) => void;
    renderRootCategorySelector: () => ReactNode;
    renderCategorySelector: () => ReactNode;
    postCategory: () => void;
    openEdittingModal: (id: string) => void;
    changeSubmitType: (type: CategorySubmitType) => void;
    updateCategory: () => void;
    changeCategoryStatus: (isHide: boolean) => void;
}

const categoryContextDefaultValue: CategoryContextValue = {
    categories: [],
    isOpenedModal: false,
    categoryInput: {
        type: "root",
        rootId: "select",
        title: "",
    },
    submitType: "create",
    changeCurrentCategoryId: () => null,
    loadAllCategories: () => null,
    changeOpenModalStatus: () => null,
    resetField: () => null,
    changeCategoryInput: () => null,
    renderRootCategorySelector: () => null,
    renderCategorySelector: () => null,
    postCategory: () => null,
    openEdittingModal: () => null,
    changeSubmitType: () => null,
    updateCategory: () => null,
    changeCategoryStatus: () => null,
};

export const CategoryContext = createContext<CategoryContextValue>(categoryContextDefaultValue);

const CategoryContextProvider = ({ children }: CategoryContextProps) => {
    const host = "http://localhost:4000";
    const categoryReducerState: CategoryReducerState = {
        categories: [],
        categoryInput: {
            type: "root",
            rootId: "select",
            title: "",
        },
    };
    const [categoryState, dispatch] = useReducer(categoryReducer, categoryReducerState);
    const { categories, categoryInput } = categoryState;
    const [isOpenedModal, setIsOpenedModal] = useState(false);
    const [submitType, setSubmitType] = useState<CategorySubmitType>("create");
    const [currentCategoryId, setCurrentCategoryId] = useState("");
    const { changeSnackbarValues } = useContext(LayoutContext);

    const changeCurrentCategoryId = (id: string) => {
        setCurrentCategoryId(id);
    };

    const changeSubmitType = (type: CategorySubmitType) => {
        setSubmitType(type);
    };

    const changeOpenModalStatus = (status?: boolean) => {
        if (status !== undefined) {
            setIsOpenedModal(status);
            return;
        }
        setIsOpenedModal(!isOpenedModal);
    };

    const handleError = (error: any) => {
        if (axios.isAxiosError(error)) {
            changeSnackbarValues({
                content: error.response?.data.message,
                isToggle: true,
                type: "error",
            });
            return;
        }
        changeSnackbarValues({
            content: "Lỗi hệ thống",
            isToggle: true,
            type: "error",
        });
    };

    const loadAllCategories = async () => {
        try {
            const response = await axios.get(`${host}/api/category`);
            if (response.data.result) {
                const data = response.data.result;
                console.log(data);
                const mappedCategories: CategoryValueInitializer[] = data.map((datum: any) => {
                    const { id, title, root_id, root_title, is_active } = datum;
                    const category: CategoryValueInitializer = {
                        id,
                        title,
                        rootId: root_id,
                        rootTitle: root_title,
                        isActive: is_active === 0 ? true : false,
                    };
                    return category;
                });
                dispatch({ type: "loadCategories", payload: mappedCategories });
            }
        } catch (error) {
            handleError(error);
        }
    };

    const changeCategoryInput = (category: CategoryInputValue) => {
        dispatch({ type: "changeCategoryInput", payload: category });
    };

    const renderRootCategorySelector = (): ReactNode => {
        return categories
            .filter((category: CategoryValueInitializer) => {
                return category.id === category.rootId;
            })
            .map((category: CategoryValueInitializer, index: number) => {
                return (
                    <MenuItem key={index} value={category.id}>
                        {category.title}
                    </MenuItem>
                );
            });
    };

    const renderCategorySelector = (): ReactNode => {
        return categories.map((category: CategoryValueInitializer, index: number) => {
            return (
                <MenuItem key={index} value={category.id}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" style={{ width: "100%" }}>
                        <Typography>{category.title}</Typography>
                        <Typography variant="caption">{category.rootTitle}</Typography>
                    </Box>
                </MenuItem>
            );
        });
    };

    const resetField = () => {
        dispatch({
            type: "changeCategoryInput",
            payload: {
                type: "root",
                rootId: "select",
                title: "",
            },
        });
    };

    const postCategory = async () => {
        try {
            console.log(categoryInput);
            const { rootId, title, type } = categoryInput;
            const data = {
                title: title,
                category_id: type === "component" ? rootId : null,
            };
            await axios.post(`${host}/api/category`, data);
            changeSnackbarValues({
                content: "New category was created!",
                isToggle: true,
                type: "success",
            });
            changeOpenModalStatus(false);
            loadAllCategories();
        } catch (error) {
            handleError(error);
        }
    };

    const fillCategoryInformation = async (id: string) => {
        try {
            const response = await axios.get(`${host}/api/category/${id}`);
            if (response.data.result) {
                const { root_id, title, id } = response.data.result;
                const transitoryData: CategoryInputValue = {
                    rootId: root_id,
                    title: title,
                    type: root_id === id ? "root" : "component",
                };
                dispatch({ type: "changeCategoryInput", payload: transitoryData });
            }
        } catch (error) {
            handleError(error);
        }
    };

    const updateCategory = async () => {
        const { rootId, title, type } = categoryInput;
        try {
            console.log(categoryInput);
            await axios.patch(`${host}/api/category/${currentCategoryId}`, {
                title,
                root_id: type === "component" ? rootId : null,
            });
            changeSnackbarValues({
                content: "Category was updated",
                isToggle: true,
                type: "success",
            });
            changeOpenModalStatus(false);
            loadAllCategories();
        } catch (error) {
            handleError(error);
        }
    };

    const changeCategoryStatus = async (isHide: boolean) => {
        try {
            await axios.patch(`${host}/api/category/status/${currentCategoryId}`, {
                status: isHide ? 1 : 0,
            });
            changeSnackbarValues({
                content: isHide ? "Category was hiden" : "Category is now visibled",
                isToggle: true,
                type: "success",
            });
            loadAllCategories();
        } catch (error) {
            handleError(error);
        }
    };

    const openEdittingModal = (id: string) => {
        setSubmitType("edit");
        fillCategoryInformation(id);
        changeOpenModalStatus(true);
    };

    const categoryContextData: CategoryContextValue = {
        categories,
        categoryInput,
        isOpenedModal,
        submitType,
        loadAllCategories,
        changeCurrentCategoryId,
        changeOpenModalStatus,
        resetField,
        changeCategoryInput,
        openEdittingModal,
        renderRootCategorySelector,
        renderCategorySelector,
        postCategory,
        changeSubmitType,
        updateCategory,
        changeCategoryStatus,
    };
    return <CategoryContext.Provider value={categoryContextData}>{children}</CategoryContext.Provider>;
};

export default CategoryContextProvider;
