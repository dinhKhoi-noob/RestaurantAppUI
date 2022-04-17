import axios from "axios";
import React, { createContext, ReactNode, SyntheticEvent, useContext, useEffect, useReducer } from "react";
import { CartAction, cartReducer, CartReducerState } from "../reducer/cartReducer";
import { LayoutContext } from "./LayoutContext";

interface CartContextProps {
    children: ReactNode;
}

export interface CartItemValueInitializer {
    id: string;
    price: number;
    title: string;
    quantity: number;
    images: string[];
}

export interface CheckoutValueInput {
    name: string;
    address: string;
    phone: string;
}

interface CartContextDefaultValue {
    cartItems: CartItemValueInitializer[];
    favoriteList: CartItemValueInitializer[];
    currentCartItem: CartItemValueInitializer;
    currentFavoriteItem: CartItemValueInitializer;
    checkoutInput: CheckoutValueInput;
    transitoryCart: CartItemValueInitializer[];
    loadCarts: () => void;
    addToCart: () => void;
    changeCurrentCartItem: (item: CartItemValueInitializer) => void;
    changeDishQuantity: (event: SyntheticEvent, id: string, quantity?: number, isOnEdit?: boolean) => void;
    storeCart: (items: CartItemValueInitializer[]) => void;
    removeCartItem: (id: string, isOnEdit?: boolean) => void;
    loadFavoriteList: () => void;
    removeFavoriteItem: (id: string) => void;
    addToFavoriteList: () => void;
    changeCurrentFavoriteItem: (favoriteItem: CartItemValueInitializer) => void;
    changeCheckoutInputValue: (value: CheckoutValueInput) => void;
    createCheckout: (uid: string) => void;
    fillCarts: (value: CartItemValueInitializer[]) => void;
}

const cartContextDefaultValue: CartContextDefaultValue = {
    cartItems: [],
    favoriteList: [],
    transitoryCart: [],
    currentCartItem: {
        id: "",
        images: [],
        price: 0,
        quantity: 0,
        title: "",
    },
    currentFavoriteItem: {
        id: "",
        images: [],
        price: 0,
        quantity: 0,
        title: "",
    },
    checkoutInput: {
        address: "select",
        name: "",
        phone: "",
    },
    loadCarts: () => null,
    addToCart: () => null,
    changeCurrentCartItem: () => null,
    changeDishQuantity: () => null,
    storeCart: () => null,
    removeCartItem: () => null,
    loadFavoriteList: () => null,
    addToFavoriteList: () => null,
    removeFavoriteItem: () => null,
    changeCurrentFavoriteItem: () => null,
    createCheckout: () => null,
    changeCheckoutInputValue: () => null,
    fillCarts: () => null,
};

export const CartContext = createContext<CartContextDefaultValue>(cartContextDefaultValue);

const CartContextProvider = ({ children }: CartContextProps) => {
    const host = "http://localhost:4000";
    const cartReducerState: CartReducerState = {
        cartItems: [],
        favoriteList: [],
        transitoryCart: [],
        currentCartItem: {
            id: "",
            images: [],
            price: 0,
            quantity: 0,
            title: "",
        },
        currentFavoriteItem: {
            id: "",
            images: [],
            price: 0,
            quantity: 0,
            title: "",
        },
        checkoutInput: {
            address: "select",
            name: "",
            phone: "",
        },
    };
    const [cartReducerValue, dispatch] = useReducer(cartReducer, cartReducerState);
    const { cartItems, currentCartItem, favoriteList, currentFavoriteItem, checkoutInput, transitoryCart } =
        cartReducerValue;
    const { changeSnackbarValues, changeHasNewOrderStatus } = useContext(LayoutContext);

    useEffect(() => {
        addToFavoriteList();
    }, [currentFavoriteItem]);

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

    const loadCarts = () => {
        if (typeof window !== "undefined") {
            const items = localStorage.getItem("cart");
            if (items) {
                const cartItems: any[] = JSON.parse(items);
                const mappedCartItems: CartItemValueInitializer[] = cartItems.map((item: any) => {
                    const { id, price, quantity, title, images } = item;
                    return {
                        id,
                        price,
                        quantity,
                        title,
                        images,
                    };
                });
                dispatch({ type: "loadCart", payload: mappedCartItems });
            } else {
                dispatch({ type: "loadCart", payload: [] });
            }
        }
    };

    const addToCart = () => {
        const { price, quantity, id, title } = currentCartItem;
        if (typeof window !== "undefined") {
            const items = localStorage.getItem("cart");
            if (items) {
                const cartItems = JSON.parse(items);
                const mappedCartItems: CartItemValueInitializer[] = cartItems.map((item: any) => {
                    const { id, price, quantity, title, images } = item;
                    return {
                        id,
                        price,
                        quantity,
                        title,
                        images,
                    };
                });
                if (price > 0 && quantity > 0) {
                    const index = mappedCartItems.findIndex(item => item.id === id);
                    if (index > -1) {
                        mappedCartItems[index].quantity = quantity;
                    } else {
                        mappedCartItems.push(currentCartItem);
                    }
                    changeSnackbarValues({
                        type: "success",
                        isToggle: true,
                        content: `Added ${quantity} ${title} to cart!`,
                    });
                    localStorage.setItem("cart", JSON.stringify(mappedCartItems));
                    loadCarts();
                } else {
                    const transitoryCart = mappedCartItems.filter((item: CartItemValueInitializer) => {
                        return item.id !== id;
                    });
                    changeSnackbarValues({
                        type: "success",
                        isToggle: true,
                        content: `Added ${quantity} ${title} to cart!`,
                    });
                    localStorage.setItem("cart", JSON.stringify(transitoryCart));
                    loadCarts();
                }
            } else {
                if (price > 0 && quantity > 0) {
                    const transitoryCart = [currentCartItem];
                    changeSnackbarValues({
                        type: "success",
                        isToggle: true,
                        content: `Added ${quantity} ${title} to cart!`,
                    });
                    localStorage.setItem("cart", JSON.stringify(transitoryCart));
                    loadCarts();
                    return;
                }
            }
        }
    };

    const changeCurrentCartItem = (item: CartItemValueInitializer) => {
        dispatch({ type: "changeCartItem", payload: item });
    };

    const changeDishQuantity = (event: SyntheticEvent, id: string, quantity?: number, isOnEdit?: boolean) => {
        const target = event.target as HTMLInputElement;
        const value = parseInt(target.value);
        console.log(isOnEdit);
        const dispatchType: CartAction = isOnEdit ? "changeTransitoryCart" : "loadCart";
        const targetCart = isOnEdit ? transitoryCart : cartItems;
        const index = targetCart.findIndex(item => item.id === id);
        if (quantity && index > -1) {
            if (targetCart[index].quantity > 0 && quantity < 0) {
                targetCart[index].quantity += quantity;
                dispatch({ type: dispatchType, payload: targetCart });
                return;
            }
            if (quantity > 0) {
                targetCart[index].quantity += quantity;
                dispatch({ type: dispatchType, payload: targetCart });
                changeCurrentCartItem({ ...currentCartItem, quantity: currentCartItem.quantity + quantity });
            }
            return;
        }
        if (target.value && target.value.length === 0) {
            targetCart[index].quantity = 0;
            dispatch({ type: dispatchType, payload: targetCart });
            changeCurrentCartItem({ ...currentCartItem, quantity: 0 });
            return;
        }
        if (!isNaN(value)) {
            targetCart[index].quantity = value;
            dispatch({ type: dispatchType, payload: targetCart });
            changeCurrentCartItem({ ...currentCartItem, quantity: value });
            return;
        }
    };

    const storeCart = (items: CartItemValueInitializer[]) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("cart", JSON.stringify(items));
            loadCarts();
        }
    };

    const removeCartItem = (id: string, isOnEdit?: boolean) => {
        const targetCart = isOnEdit !== undefined && isOnEdit ? transitoryCart : cartItems;
        const index = targetCart.findIndex(item => item.id === id);
        targetCart.splice(index, 1);
        storeCart(cartItems);
    };

    const loadFavoriteList = () => {
        if (typeof window !== "undefined") {
            const items = localStorage.getItem("favorite");
            if (items) {
                const favoriteItems: any[] = JSON.parse(items);
                const mappedFavoriteItems: CartItemValueInitializer[] = favoriteItems.map((item: any) => {
                    const { id, price, quantity, title, images } = item;
                    return {
                        id,
                        price,
                        quantity,
                        title,
                        images,
                    };
                });
                dispatch({ type: "loadFavoriteList", payload: mappedFavoriteItems });
            } else {
                dispatch({ type: "loadFavoriteList", payload: [] });
            }
        }
    };

    const removeFavoriteItem = (id: string) => {
        console.log(id, favoriteList);
        const index = favoriteList.findIndex(item => item.id === id);
        if (index > -1) {
            console.log(index);
            favoriteList.splice(index, 1);
            localStorage.setItem("favorite", JSON.stringify(favoriteList));
            loadFavoriteList();
        }
    };

    const changeCurrentFavoriteItem = (favoriteItem: CartItemValueInitializer) => {
        dispatch({ type: "changeFavoriteItem", payload: favoriteItem });
    };

    const addToFavoriteList = () => {
        if (typeof window !== "undefined") {
            const items = window.localStorage.getItem("favorite");
            if (items && currentFavoriteItem.id !== "") {
                const favoriteList: any[] = JSON.parse(items);
                const mappedFavoriteItems: CartItemValueInitializer[] = favoriteList.map((item: any) => {
                    const { id, price, quantity, title, images } = item;
                    return {
                        id,
                        price,
                        quantity,
                        title,
                        images,
                    };
                });
                if (favoriteList.findIndex(item => item.id === currentFavoriteItem.id)) {
                    mappedFavoriteItems.push(currentFavoriteItem);
                    localStorage.setItem("favorite", JSON.stringify(mappedFavoriteItems));
                    loadFavoriteList();
                }
            } else {
                if (currentFavoriteItem.id !== "") {
                    localStorage.setItem("favorite", JSON.stringify([currentFavoriteItem]));
                    loadFavoriteList();
                }
            }
        }
    };

    const changeCheckoutInputValue = (value: CheckoutValueInput) => {
        dispatch({ type: "changeCheckoutInput", payload: value });
    };

    const createCheckout = async (uid: string) => {
        try {
            const { address, name, phone } = checkoutInput;
            await axios.post(`${host}/api/checkout`, {
                uid,
                orderList: cartItems,
                total:
                    cartItems.length === 0
                        ? 0
                        : cartItems.map(item => item.price * item.quantity).reduce((prev, next) => prev + next),
                address,
                phone,
                username: name,
            });
            changeSnackbarValues({
                isToggle: true,
                type: "success",
                content: "Your order has been created, please wait our manager confirm your order",
            });
            changeHasNewOrderStatus(true);
            changeCheckoutInputValue({
                address: "select",
                name: "",
                phone: "",
            });
            localStorage.removeItem("cart");
            loadCarts();
        } catch (error) {
            handleError(error);
        }
    };

    const fillCarts = (value: CartItemValueInitializer[]) => {
        dispatch({ type: "changeTransitoryCart", payload: value });
    };

    const cartContextData: CartContextDefaultValue = {
        cartItems,
        currentCartItem,
        favoriteList,
        currentFavoriteItem,
        checkoutInput,
        transitoryCart,
        addToCart,
        loadCarts,
        changeCurrentCartItem,
        changeDishQuantity,
        storeCart,
        removeCartItem,
        addToFavoriteList,
        loadFavoriteList,
        removeFavoriteItem,
        changeCurrentFavoriteItem,
        changeCheckoutInputValue,
        createCheckout,
        fillCarts,
    };
    return <CartContext.Provider value={cartContextData}>{children}</CartContext.Provider>;
};

export default CartContextProvider;
