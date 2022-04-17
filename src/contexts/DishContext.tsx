/* eslint-disable camelcase */
import axios from "axios";
import React, { createContext, ReactNode, useContext, useReducer, useState } from "react";
import { dishReducer, DishReducerState } from "../reducer/dishReducer";
import { LayoutContext } from "./LayoutContext";
import { UploadFileContext } from "./UploadFileContext";

type DishSubmitType = "create" | "update";

interface DishContextProps {
    children: ReactNode;
}

export interface DishValueInitializer {
    id: string;
    title: string;
    description: string;
    price: number;
    isActive: boolean;
    categoryId: string;
    categoryTitle: string;
}

export interface DishInputValue {
    title: string;
    categoryId: string;
    price: number;
    description: string;
}

export interface DishImageValue {
    id: string;
    url: string;
    dishId: string;
}

export interface DishRatingValue {
    id: string;
    username: string;
    dateCreated: Date;
    point: number;
    avatar: string;
    comment: string | undefined;
    userId: string;
    dishId: string;
}

export interface DishRatingInput {
    point: number;
    comment: string | undefined;
}

interface DishContextDefaultValue {
    dishInput: DishInputValue;
    dishes: DishValueInitializer[];
    isOpenedModal: boolean;
    currentDishId: string;
    submitType: DishSubmitType;
    allDishImages: DishImageValue[];
    specificDishImages: DishImageValue[];
    dishRatingInput: DishRatingInput;
    dishRatings: DishRatingValue[];
    allDishRatings: DishRatingValue[];
    specificDishInfo: DishValueInitializer | undefined;
    changeSubmitType: (type: DishSubmitType) => void;
    resetField: () => void;
    loadAllDishes: (loadHidden?: boolean, search?: string) => void;
    changeOpenModalStatus: (status?: boolean) => void;
    changeCurrentDishId: (id: string) => void;
    changeDishInputValue: (dish: DishInputValue) => void;
    createNewDish: (images: string[]) => void;
    loadAllImages: () => void;
    loadSpecificDishImages: (id: string) => void;
    loadSpecificDishInformation: (id: string) => void;
    fillDishValue: (id: string) => void;
    changeDishStatus: (isHide: boolean) => void;
    updateDishInformation: (images?: string[]) => void;
    loadAllRating: () => void;
    loadSpecificDishRating: (id: string) => void;
    changeRatingInput: (rating: DishRatingInput) => void;
    postNewRating: (uid: string) => void;
    resetData: () => void;
}

const dishContextDefaultValue: DishContextDefaultValue = {
    dishes: [],
    dishInput: {
        categoryId: "select",
        price: 0,
        title: "",
        description: "",
    },
    dishRatingInput: {
        comment: undefined,
        point: 0,
    },
    currentDishId: "",
    isOpenedModal: false,
    submitType: "create",
    allDishImages: [],
    specificDishImages: [],
    specificDishInfo: undefined,
    allDishRatings: [],
    dishRatings: [],
    changeSubmitType: () => null,
    resetField: () => null,
    loadAllDishes: () => null,
    changeCurrentDishId: () => null,
    changeOpenModalStatus: () => null,
    changeDishInputValue: () => null,
    createNewDish: () => null,
    loadAllImages: () => null,
    loadSpecificDishImages: () => null,
    loadSpecificDishInformation: () => null,
    fillDishValue: () => null,
    changeDishStatus: () => null,
    updateDishInformation: () => null,
    loadAllRating: () => null,
    changeRatingInput: () => null,
    loadSpecificDishRating: () => null,
    postNewRating: () => null,
    resetData: () => null,
};

export const DishContext = createContext<DishContextDefaultValue>(dishContextDefaultValue);

const DishContextProvider = ({ children }: DishContextProps) => {
    const dishReducerState: DishReducerState = {
        dishInput: {
            categoryId: "select",
            price: 0,
            title: "",
            description: "",
        },
        dishes: [],
        allDishImages: [],
        specificDishImages: [],
        dishRatings: [],
        allDishRatings: [],
        dishRatingInput: {
            comment: undefined,
            point: 0,
        },
        specificDishInfo: undefined,
    };
    const host = "http://localhost:4000";
    const [dishState, dispatch] = useReducer(dishReducer, dishReducerState);
    const [isOpenedModal, setIsOpenedModal] = useState(false);
    const [currentDishId, setCurrentDishId] = useState("");
    const [submitType, setSubmitType] = useState<DishSubmitType>("create");
    const { changeSnackbarValues, changeLoadingStatus } = useContext(LayoutContext);
    const { changeCurrentFilePaths } = useContext(UploadFileContext);
    const {
        dishInput,
        dishes,
        allDishImages,
        specificDishImages,
        specificDishInfo,
        dishRatingInput,
        dishRatings,
        allDishRatings,
    } = dishState;

    const handleError = (error: any) => {
        changeLoadingStatus(false);
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

    const resetField = () => {
        dispatch({
            type: "changeDishInput",
            payload: {
                price: 0,
                categoryId: "select",
                title: "",
                description: "",
            },
        });
    };

    const changeSubmitType = (type: DishSubmitType) => {
        setSubmitType(type);
    };

    const changeCurrentDishId = (id: string) => {
        setCurrentDishId(id);
    };

    const changeOpenModalStatus = (status?: boolean) => {
        if (status !== undefined) {
            setIsOpenedModal(status);
            return;
        }
        setIsOpenedModal(!isOpenedModal);
    };

    const loadAllDishes = async (loadHidden?: boolean, search?: string) => {
        try {
            console.log(1);
            let endpoint = `${host}/api/product${loadHidden ? "?load_all=true" : ""}`;
            if (search && loadHidden) {
                endpoint += `&search=${search}`;
            }
            if (search && !loadHidden) {
                endpoint += `?search=${search}`;
            }
            console.log(endpoint);
            const response = await axios.get(endpoint);
            if (response.data.result) {
                const data = response.data.result;
                const mappedDishes = data.map((dish: any) => {
                    const { id, title, description, price, category_title, category_id, is_active, category_status } =
                        dish;
                    const returnValues: DishValueInitializer = {
                        id,
                        title,
                        description,
                        price,
                        categoryId: category_id,
                        categoryTitle: category_title,
                        isActive: is_active === 0 && category_status === 0,
                    };
                    return returnValues;
                });
                dispatch({ type: "loadDishes", payload: mappedDishes });
            }
        } catch (error) {
            handleError(error);
        }
    };

    const createNewDish = async (images: string[]) => {
        try {
            const { categoryId, price, title, description } = dishInput;
            const response = await axios.post(`${host}/api/product`, {
                title,
                price,
                category_id: categoryId,
                description,
            });
            console.log(response);
            if (response.data.id) {
                const id = response.data.id;
                await axios.post(`${host}/api/image/${id}`, { images });
                changeSnackbarValues({
                    content: "New dish was created",
                    isToggle: true,
                    type: "success",
                });
                loadAllDishes(true);
                changeLoadingStatus(false);
                return;
            }
            changeLoadingStatus(false);
            changeOpenModalStatus(false);
        } catch (error) {
            handleError(error);
        }
    };

    const changeDishInputValue = (dish: DishInputValue) => {
        dispatch({ type: "changeDishInput", payload: dish });
    };

    const loadAllImages = async () => {
        try {
            const response = await axios.get(`${host}/api/image`);
            const data = response.data.result;
            if (data) {
                const mappedImage: DishImageValue[] = data.map((image: any) => {
                    const { id, url, product_id } = image;
                    return {
                        id,
                        url,
                        dishId: product_id,
                    };
                });
                dispatch({ type: "loadAllImages", payload: mappedImage });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadAllImages", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const loadSpecificDishImages = async (id: string) => {
        try {
            const response = await axios.get(`${host}/api/image/${id}`);
            const data = response.data.result;
            if (data) {
                const mappedImage: DishImageValue[] = data.map((image: any) => {
                    const { id, url, product_id } = image;
                    return {
                        id,
                        url,
                        dishId: product_id,
                    };
                });
                changeCurrentFilePaths(mappedImage.map((image: DishImageValue) => image.url));
                dispatch({ type: "loadSpecificImages", payload: mappedImage });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadSpecificImages", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const loadSpecificDishInput = async (id: string) => {
        try {
            const response = await axios.get(`${host}/api/product/specific/${id}`);
            console.log(`${host}/api/product/specific/${id}`);
            const data = response.data.result;
            console.log(data);
            if (data) {
                const { title, description, category_id, price } = data;
                const dishInput: DishInputValue = {
                    price,
                    categoryId: category_id,
                    title,
                    description,
                };
                dispatch({ type: "changeDishInput", payload: dishInput });
            }
        } catch (error) {
            handleError(error);
        }
    };

    const updateDishInformation = async (images?: string[]) => {
        try {
            const { categoryId, price, title, description } = dishInput;
            if (images && images.length > 0) {
                await axios.patch(`${host}/api/image/${currentDishId}`, { images });
            }
            await axios.patch(`${host}/api/product/${currentDishId}`, {
                title,
                price,
                category_id: categoryId,
                description,
            });
            loadAllDishes(true);
            loadAllImages();
            changeSnackbarValues({
                content: "Information was updated",
                isToggle: true,
                type: "success",
            });
            changeLoadingStatus(false);
        } catch (error) {
            handleError(error);
        }
    };

    const changeDishStatus = async (isHide: boolean) => {
        try {
            await axios.patch(`${host}/api/product/status/${currentDishId}`, {
                status: isHide ? 1 : 0,
            });
            loadAllDishes(true);
            changeSnackbarValues({
                content: `Dish was ${isHide ? "hide" : "unhide"}`,
                isToggle: true,
                type: "success",
            });
        } catch (error) {
            handleError(error);
        }
    };

    const fillDishValue = async (id: string) => {
        await loadSpecificDishInput(id);
        await loadSpecificDishImages(id);
        changeOpenModalStatus(true);
    };

    const loadSpecificDishInformation = async (id: string) => {
        try {
            const response = await axios.get(`${host}/api/product/specific/${id}`);
            const data = response.data.result;
            console.log(data);
            if (data) {
                const { title, description, category_id, price, id, category_title, is_active } = data;
                const dishInput: DishValueInitializer = {
                    price,
                    categoryId: category_id,
                    title,
                    description,
                    id,
                    categoryTitle: category_title,
                    isActive: is_active === 0 ? true : false,
                };
                dispatch({ type: "loadDishInfo", payload: dishInput });
            }
        } catch (error) {
            handleError(error);
        }
    };

    const loadAllRating = async () => {
        try {
            const response = await axios.get(`${host}/api/rate`);
            const data = response.data.result;
            if (data) {
                const mappedRatingList: DishRatingValue[] = data.map((value: any) => {
                    const { id, rate_by, dish_id, rate_point, comment, date_created, username, avatar } = value;
                    return {
                        id,
                        username,
                        dateCreated: new Date(date_created),
                        point: rate_point,
                        avatar,
                        comment: comment === null ? comment : undefined,
                        userId: rate_by,
                        dishId: dish_id,
                    };
                });
                dispatch({ type: "loadAllRating", payload: mappedRatingList });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadAllRating", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const loadSpecificDishRating = async (id: string) => {
        try {
            const response = await axios.get(`${host}/api/rate/${id}`);
            const data = response.data.result;
            if (data) {
                const mappedRatingList: DishRatingValue[] = data.map((value: any) => {
                    const { id, rate_by, dish_id, rate_point, comment, date_created, username, avatar } = value;
                    console.log(value);
                    return {
                        id,
                        username,
                        dateCreated: new Date(date_created),
                        point: rate_point,
                        avatar,
                        comment: comment === "null" ? undefined : comment,
                        userId: rate_by,
                        dishId: dish_id,
                    };
                });
                dispatch({ type: "loadDishRating", payload: mappedRatingList });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadDishRating", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const changeRatingInput = (rating: DishRatingInput) => {
        dispatch({ type: "changeRatingInput", payload: rating });
    };

    const postNewRating = async (uid: string) => {
        const { comment, point } = dishRatingInput;
        try {
            await axios.post(`${host}/api/rate`, {
                post_by: uid,
                comment: comment ? comment : null,
                point,
                dish_id: currentDishId,
            });
            changeSnackbarValues({
                isToggle: true,
                type: "success",
                content: "Thank for your rating",
            });
            loadSpecificDishRating(currentDishId);
        } catch (error) {
            handleError(error);
        }
    };

    const resetData = () => {
        dispatch({ type: "loadDishRating", payload: [] });
        dispatch({ type: "loadSpecificImages", payload: [] });
        dispatch({
            type: "changeRatingInput",
            payload: {
                comment: undefined,
                point: 0,
            },
        });
    };

    const dishContextData: DishContextDefaultValue = {
        dishInput,
        dishes,
        currentDishId,
        isOpenedModal,
        submitType,
        allDishImages,
        specificDishImages,
        specificDishInfo,
        allDishRatings,
        dishRatings,
        dishRatingInput,
        changeSubmitType,
        resetField,
        loadAllDishes,
        changeCurrentDishId,
        changeOpenModalStatus,
        changeDishInputValue,
        createNewDish,
        loadAllImages,
        loadSpecificDishImages,
        fillDishValue,
        changeDishStatus,
        updateDishInformation,
        loadSpecificDishInformation,
        changeRatingInput,
        loadAllRating,
        loadSpecificDishRating,
        postNewRating,
        resetData,
    };
    return <DishContext.Provider value={dishContextData}>{children}</DishContext.Provider>;
};

export default DishContextProvider;
