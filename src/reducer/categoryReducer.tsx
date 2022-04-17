import { CategoryInputValue, CategoryValueInitializer } from "../contexts/CategoryContext";

export type CategoryAction = "loadCategories" | "changeCategoryInput";

export interface CategoryReducerState {
    categories: CategoryValueInitializer[];
    categoryInput: CategoryInputValue;
}

interface CategoryReducerAction {
    type: CategoryAction;
    payload: CategoryValueInitializer[] | CategoryInputValue;
}

export const categoryReducer = (state: CategoryReducerState, actions: CategoryReducerAction) => {
    const { type, payload } = actions;
    switch (type) {
        case "loadCategories":
            return {
                ...state,
                categories: payload as CategoryValueInitializer[],
            };
        case "changeCategoryInput":
            return {
                ...state,
                categoryInput: payload as CategoryInputValue,
            };
        default:
            return state;
    }
};
