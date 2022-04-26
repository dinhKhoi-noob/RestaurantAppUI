/* eslint-disable camelcase */
import axios from "axios";
import React, { createContext, ReactNode, useContext, useReducer, useState } from "react";
import { orderReducer, OrderReducerState } from "../reducer/orderReducer";
import { CartContext } from "./CartContext";
import { LayoutContext } from "./LayoutContext";

interface OrderContextProps {
    children: ReactNode;
}

export interface OrderValueInitializer {
    id: string;
    dateCreated: Date;
    address: string;
    phone: string;
    status: string;
    fullName: string;
    total: number;
    isConfirmed: boolean;
    userId: string;
    addressId: string;
}

export interface OrderItemValueInitializer {
    quantity: number;
    price: number;
    productName: string;
    id: string;
    thumbnail: string;
}

interface OrderContextDefault {
    orders: OrderValueInitializer[];
    orderItems: OrderItemValueInitializer[];
    orderInfo: OrderValueInitializer;
    allOrderItems: OrderItemValueInitializer[];
    currentOrderId: string;
    loadAllOrders: (uid?: string, dateBegin?: Date, dateEnd?: Date) => void;
    loadAllOrderItems: () => void;
    loadSpecificOrder: (id: string) => void;
    changeCurrentOrderId: (id: string) => void;
    updateOrder: () => void;
    changeStatusOrder: (status: string) => void;
    confirmOrder: (isCancel: boolean) => void;
}

const orderContextDefault: OrderContextDefault = {
    orders: [],
    orderItems: [],
    allOrderItems: [],
    orderInfo: {
        id: "",
        address: "",
        addressId: "",
        dateCreated: new Date(Date.now()),
        fullName: "",
        isConfirmed: false,
        phone: "",
        status: "",
        total: 0,
        userId: "",
    },
    currentOrderId: "",
    loadAllOrders: () => null,
    loadAllOrderItems: () => null,
    loadSpecificOrder: () => null,
    changeCurrentOrderId: () => null,
    updateOrder: () => null,
    changeStatusOrder: () => null,
    confirmOrder: () => null,
};

export const OrderContext = createContext<OrderContextDefault>(orderContextDefault);

const OrderContextProvider = ({ children }: OrderContextProps) => {
    const host = "http://localhost:4000";
    const { changeSnackbarValues, changeLoadingStatus } = useContext(LayoutContext);
    const { transitoryCart, checkoutInput } = useContext(CartContext);
    const [currentOrderId, setCurrentOrderId] = useState("");
    const orderReducerValue: OrderReducerState = {
        orders: [],
        orderItems: [],
        allOrderItems: [],
        orderInfo: {
            id: "",
            address: "",
            addressId: "",
            dateCreated: new Date(Date.now()),
            fullName: "",
            isConfirmed: false,
            phone: "",
            status: "",
            total: 0,
            userId: "",
        },
    };

    const changeCurrentOrderId = (id: string) => {
        setCurrentOrderId(id);
    };

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
    const [orderReducerState, dispatch] = useReducer(orderReducer, orderReducerValue);
    const { orders, orderInfo, orderItems, allOrderItems } = orderReducerState;

    const loadAllOrders = async (uid?: string, dateBegin?: Date, dateEnd?: Date) => {
        try {
            const response = await axios.get(
                `${host}/api/checkout${
                    uid !== undefined
                        ? `/${uid}`
                        : `${dateBegin && dateEnd ? `?date_begin=${dateBegin}&date_end=${dateEnd}` : ``}`
                }`
            );
            const data = response.data.result;
            if (data) {
                const mappedOrders: OrderValueInitializer[] = data.map((order: any) => {
                    const {
                        id,
                        user_id,
                        date_created,
                        status,
                        full_name,
                        phone,
                        is_confirm,
                        total,
                        address,
                        address_id,
                    } = order;
                    const returnValues: OrderValueInitializer = {
                        id,
                        address,
                        addressId: address_id,
                        dateCreated: date_created,
                        fullName: full_name,
                        isConfirmed: is_confirm === 0 ? true : false,
                        phone,
                        status,
                        total,
                        userId: user_id,
                    };
                    return returnValues;
                });
                dispatch({ type: "loadOrders", payload: mappedOrders });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                dispatch({ type: "loadOrders", payload: [] });
                return;
            }
            handleError(error);
        }
    };

    const loadAllOrderItems = async () => {
        try {
            const response = await axios.get(`${host}/api/checkout/item`);
            const data = response.data.result;
            if (data) {
                const mappedOrderItems: OrderItemValueInitializer[] = data.map((item: any) => {
                    const { product_id, quantity, price, product_name, thumbnail } = item;
                    const returnValues: OrderItemValueInitializer = {
                        id: product_id,
                        price,
                        productName: product_name,
                        quantity,
                        thumbnail,
                    };
                    return returnValues;
                });
                dispatch({ type: "loadAllOrderItems", payload: mappedOrderItems });
            }
        } catch (error) {
            handleError(error);
        }
    };

    const loadSpecificOrder = async (id: string) => {
        try {
            const orderResponse = await (await axios.get(`${host}/api/checkout/specific/${id}`)).data.result;
            const orderItemsResponse = await (await axios.get(`${host}/api/checkout/item/${id}`)).data.result;
            if (orderItemsResponse && orderResponse) {
                const { id, user_id, date_created, status, full_name, phone, is_confirm, total, address, address_id } =
                    orderResponse;
                const mappedOrderInfo: OrderValueInitializer = {
                    id,
                    address,
                    addressId: address_id,
                    dateCreated: date_created,
                    fullName: full_name,
                    isConfirmed: is_confirm === 0 ? true : false,
                    phone,
                    status,
                    total,
                    userId: user_id,
                };
                const mappedOrderItems: OrderItemValueInitializer[] = orderItemsResponse.map((item: any) => {
                    const { product_id, quantity, price, product_name, thumbnail } = item;
                    const returnValues: OrderItemValueInitializer = {
                        id: product_id,
                        price,
                        productName: product_name,
                        quantity,
                        thumbnail,
                    };
                    return returnValues;
                });
                dispatch({ type: "loadOrderInfo", payload: mappedOrderInfo });
                dispatch({ type: "loadOrderItems", payload: mappedOrderItems });
            }
        } catch (error) {
            handleError(error);
        }
    };

    const updateOrder = async () => {
        try {
            const { address, name, phone } = checkoutInput;
            console.log(`${host}/api/checkout/${currentOrderId}`);
            await axios.patch(`${host}/api/checkout/${currentOrderId}`, {
                orderList: transitoryCart,
                total:
                    transitoryCart.length > 0
                        ? transitoryCart.map(item => item.price * item.quantity).reduce((prev, next) => prev + next)
                        : 0,
                address,
                phone,
                username: name,
            });
            changeSnackbarValues({
                content: "Your order has been updated",
                isToggle: true,
                type: "success",
            });
            loadSpecificOrder(currentOrderId);
        } catch (error) {
            handleError(error);
        }
    };

    const changeStatusOrder = async (status: string) => {
        try {
            await axios.patch(`${host}/api/checkout/status/${currentOrderId}`, { status });
            changeSnackbarValues({
                isToggle: true,
                type: "success",
                content: "The order status has been updated",
            });
            loadSpecificOrder(currentOrderId);
        } catch (error) {
            handleError(error);
        }
    };

    const confirmOrder = async (isCancel: boolean) => {
        try {
            await axios.patch(`${host}/api/checkout/confirm/${currentOrderId}`, { status: isCancel ? 0 : 1 });
            changeSnackbarValues({
                isToggle: true,
                type: "success",
                content: "This order has been confirmed",
            });
            loadSpecificOrder(currentOrderId);
        } catch (error) {
            handleError(error);
        }
    };

    const orderContextData: OrderContextDefault = {
        orders,
        orderInfo,
        orderItems,
        currentOrderId,
        allOrderItems,
        loadAllOrders,
        loadAllOrderItems,
        loadSpecificOrder,
        changeCurrentOrderId,
        updateOrder,
        changeStatusOrder,
        confirmOrder,
    };
    return <OrderContext.Provider value={orderContextData}>{children}</OrderContext.Provider>;
};

export default OrderContextProvider;
