import { CartItemValueInitializer, CheckoutValueInput } from "../contexts/CartContext";

export type CartAction =
    | "loadCart"
    | "changeCartItem"
    | "loadFavoriteList"
    | "changeFavoriteItem"
    | "changeCheckoutInput"
    | "changeTransitoryCart";

export interface CartReducerState {
    cartItems: CartItemValueInitializer[];
    favoriteList: CartItemValueInitializer[];
    currentCartItem: CartItemValueInitializer;
    currentFavoriteItem: CartItemValueInitializer;
    checkoutInput: CheckoutValueInput;
    transitoryCart: CartItemValueInitializer[];
}

interface CartReducerAction {
    type: CartAction;
    payload: CartItemValueInitializer[] | CartItemValueInitializer | CheckoutValueInput;
}

export const cartReducer = (state: CartReducerState, actions: CartReducerAction) => {
    const { type, payload } = actions;
    console.log(type, payload);
    switch (type) {
        case "loadCart":
            return {
                ...state,
                cartItems: payload as CartItemValueInitializer[],
            };
        case "changeCartItem":
            return {
                ...state,
                currentCartItem: payload as CartItemValueInitializer,
            };
        case "loadFavoriteList":
            return {
                ...state,
                favoriteList: payload as CartItemValueInitializer[],
            };
        case "changeFavoriteItem":
            return {
                ...state,
                currentFavoriteItem: payload as CartItemValueInitializer,
            };
        case "changeCheckoutInput":
            return {
                ...state,
                checkoutInput: payload as CheckoutValueInput,
            };
        case "changeTransitoryCart":
            return {
                ...state,
                transitoryCart: payload as CartItemValueInitializer[],
            };
        default:
            return state;
    }
};
