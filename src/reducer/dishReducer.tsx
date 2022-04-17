import {
    DishImageValue,
    DishInputValue,
    DishRatingInput,
    DishRatingValue,
    DishValueInitializer,
} from "../contexts/DishContext";

export type DishAction =
    | "loadDishes"
    | "changeDishInput"
    | "loadAllImages"
    | "loadSpecificImages"
    | "loadDishInfo"
    | "loadDishRating"
    | "changeRatingInput"
    | "loadAllRating";

export interface DishReducerState {
    dishes: DishValueInitializer[];
    dishInput: DishInputValue;
    allDishImages: DishImageValue[];
    specificDishImages: DishImageValue[];
    specificDishInfo: DishValueInitializer | undefined;
    dishRatings: DishRatingValue[];
    dishRatingInput: DishRatingInput;
    allDishRatings: DishRatingValue[];
}

interface DishReducerAction {
    type: DishAction;
    payload:
        | DishValueInitializer[]
        | DishInputValue
        | DishImageValue[]
        | DishValueInitializer
        | DishRatingInput
        | DishRatingValue[];
}

export const dishReducer = (state: DishReducerState, actions: DishReducerAction) => {
    const { type, payload } = actions;
    console.log(type, payload);
    switch (type) {
        case "loadDishes":
            return {
                ...state,
                dishes: payload as DishValueInitializer[],
            };
        case "changeDishInput":
            return {
                ...state,
                dishInput: payload as DishInputValue,
            };
        case "loadAllImages":
            return {
                ...state,
                allDishImages: payload as DishImageValue[],
            };
        case "loadSpecificImages":
            return {
                ...state,
                specificDishImages: payload as DishImageValue[],
            };
        case "loadDishInfo":
            return {
                ...state,
                specificDishInfo: payload as DishValueInitializer,
            };
        case "loadDishRating":
            return {
                ...state,
                dishRatings: payload as DishRatingValue[],
            };
        case "changeRatingInput":
            return {
                ...state,
                dishRatingInput: payload as DishRatingInput,
            };
        case "loadAllRating":
            return {
                ...state,
                allDishRatings: payload as DishRatingValue[],
            };
        default:
            return state;
    }
};
