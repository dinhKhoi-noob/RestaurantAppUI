import { OrderItemValueInitializer, OrderValueInitializer } from "../contexts/OrderContext";

export type OrderAction = "loadOrders" | "changeOrderInput" | "loadOrderInfo" | "loadOrderItems" | "loadAllOrderItems";

export interface OrderReducerState {
    orders: OrderValueInitializer[];
    orderInfo: OrderValueInitializer;
    orderItems: OrderItemValueInitializer[];
    allOrderItems: OrderItemValueInitializer[];
}

interface OrderReducerAction {
    type: OrderAction;
    payload: OrderValueInitializer[] | OrderItemValueInitializer[] | OrderValueInitializer;
}

export const orderReducer = (state: OrderReducerState, actions: OrderReducerAction) => {
    const { type, payload } = actions;
    switch (type) {
        case "loadOrders":
            return {
                ...state,
                orders: payload as OrderValueInitializer[],
            };
        case "loadOrderInfo":
            return {
                ...state,
                orderInfo: payload as OrderValueInitializer,
            };
        case "loadOrderItems":
            return {
                ...state,
                orderItems: payload as OrderItemValueInitializer[],
            };
        case "loadAllOrderItems":
            return {
                ...state,
                allOrderItems: payload as OrderItemValueInitializer[],
            };
        default:
            return state;
    }
};
