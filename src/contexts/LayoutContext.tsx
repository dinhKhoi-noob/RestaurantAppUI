import { SnackbarOrigin } from "@mui/material";
import React, { createContext, ReactElement, ReactNode, useState } from "react";

export type SnackbarType = "error" | "info" | "success" | "warning";

export type UserConfirmationType = "loggout" | "addNewAddress";
export type CategoryConfirmationType = "createCategory" | "updateCategory" | "hideCategory" | "unhideCategory";
export type DishConfirmationType = "createDish" | "updateDish" | "hideDish" | "unhideDish" | "leaveComment";
export type OrderConfirmationType =
    | "createOrder"
    | "updateOrder"
    | "confirmOrder"
    | "cancelOrder"
    | "changeToReady"
    | "changeToDelivering"
    | "changeToDeliveried"
    | "changeToConfirmed"
    | "changeToCancel";

interface LayoutContextProps {
    children: ReactNode;
}

interface ConfirmationModalValuesInitializer {
    title: string;
    isToggle: boolean;
    type: UserConfirmationType | CategoryConfirmationType | DishConfirmationType | OrderConfirmationType;
}

export interface SnackbarProps {
    type: SnackbarType;
    content: string;
    isToggle: boolean;
}

export interface NavigationBarValue {
    icon: ReactElement;
    title: string;
    url: string;
    role: string[];
}

interface LayoutContextValue {
    isOpenLeftNavbar: boolean;
    isHideLayout: boolean;
    onLoading: boolean;
    isOpenCart: boolean;
    isOpenFavoriteList: boolean;
    isOpenAddressModal: boolean;
    hasNewOrder: boolean;
    snackbarValues: SnackbarProps;
    snackbarPosition: SnackbarOrigin;
    confirmationModalValue: ConfirmationModalValuesInitializer;
    changeSnackbarStatus: (status: boolean) => void;
    changeSnackbarValues: (values: SnackbarProps) => void;
    changeSnackbarPosition: (position: SnackbarOrigin) => void;
    handleToggleOnNavbar: (status?: boolean) => void;
    changeLayoutHidenStatus: (status?: boolean) => void;
    changeConfirmationModalValues: (value: ConfirmationModalValuesInitializer) => void;
    changeLoadingStatus: (status?: boolean) => void;
    changeOpenCartStatus: (status?: boolean) => void;
    changeOpenFavoriteListStatus: (status?: boolean) => void;
    changeOpenAddressModalStatus: (status?: boolean) => void;
    changeHasNewOrderStatus: (status?: boolean) => void;
}

const layoutContextValueDefault: LayoutContextValue = {
    isOpenLeftNavbar: false,
    isHideLayout: false,
    onLoading: false,
    isOpenCart: false,
    isOpenFavoriteList: false,
    snackbarValues: {
        content: "",
        isToggle: false,
        type: "info",
    },
    snackbarPosition: {
        horizontal: "left",
        vertical: "top",
    },
    confirmationModalValue: {
        isToggle: false,
        type: "loggout",
        title: "",
    },
    isOpenAddressModal: false,
    hasNewOrder: false,
    changeSnackbarPosition: () => null,
    changeSnackbarStatus: () => null,
    changeSnackbarValues: () => null,
    handleToggleOnNavbar: () => null,
    changeLayoutHidenStatus: () => null,
    changeConfirmationModalValues: () => null,
    changeLoadingStatus: () => null,
    changeOpenCartStatus: () => null,
    changeOpenFavoriteListStatus: () => null,
    changeOpenAddressModalStatus: () => null,
    changeHasNewOrderStatus: () => null,
};

export const LayoutContext = createContext<LayoutContextValue>(layoutContextValueDefault);

const LayoutContextProvider = ({ children }: LayoutContextProps) => {
    const [isOpenLeftNavbar, setIsOpenLeftNavbar] = useState(false);
    const [isHideLayout, setIsHideLayout] = useState(false);
    const [onLoading, setOnLoading] = useState(false);
    const [isOpenCart, setIsOpenCart] = useState(false);
    const [isOpenFavoriteList, setIsOpenFavoriteList] = useState(false);
    const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
    const [snackbarValues, setSnackbarValues] = useState<SnackbarProps>({
        content: "",
        type: "info",
        isToggle: false,
    });
    const [snackbarPosition, setSnackbarPosition] = useState<SnackbarOrigin>({
        vertical: "top",
        horizontal: "right",
    });
    const [confirmationModalValue, setConfirmationModalValue] = useState<ConfirmationModalValuesInitializer>({
        isToggle: false,
        title: "",
        type: "loggout",
    });

    const [hasNewOrder, setHasNewOrder] = useState(false);

    const changeHasNewOrderStatus = (status?: boolean) => {
        if (status !== undefined) {
            setHasNewOrder(status);
            return;
        }
        setHasNewOrder(!hasNewOrder);
    };

    const changeOpenAddressModalStatus = (status?: boolean) => {
        if (status !== undefined) {
            setIsOpenAddressModal(status);
            return;
        }
        setIsOpenAddressModal(!isOpenAddressModal);
    };

    const changeOpenFavoriteListStatus = (status?: boolean) => {
        if (status !== undefined) {
            setIsOpenFavoriteList(status);
            return;
        }
        setIsOpenFavoriteList(!isOpenCart);
    };

    const changeOpenCartStatus = (status?: boolean) => {
        if (status !== undefined) {
            setIsOpenCart(status);
            return;
        }
        setIsOpenCart(!isOpenCart);
    };

    const changeLoadingStatus = (status?: boolean) => {
        if (status !== undefined) {
            setOnLoading(status);
            return;
        }
        setOnLoading(!onLoading);
    };

    const changeConfirmationModalValues = (value: ConfirmationModalValuesInitializer) => {
        setConfirmationModalValue(value);
    };

    const changeSnackbarStatus = (status: boolean) => {
        setSnackbarValues({ ...snackbarValues, isToggle: status });
    };

    const changeSnackbarPosition = (position: SnackbarOrigin) => {
        setSnackbarPosition(position);
    };

    const changeSnackbarValues = (values: SnackbarProps) => {
        console.log(values);
        const { content, type, isToggle } = values;
        setSnackbarValues({ ...snackbarValues, content, type, isToggle });
    };

    const changeLayoutHidenStatus = (status?: boolean) => {
        if (status !== undefined) {
            setIsHideLayout(status);
            return;
        }
        setIsHideLayout(!isHideLayout);
    };

    const handleToggleOnNavbar = (status?: boolean) => {
        if (status !== undefined) {
            setIsOpenLeftNavbar(status);
            return;
        }
        setIsOpenLeftNavbar(!isOpenLeftNavbar);
    };
    const layoutContextData: LayoutContextValue = {
        isHideLayout,
        isOpenLeftNavbar,
        onLoading,
        isOpenFavoriteList,
        snackbarPosition,
        snackbarValues,
        confirmationModalValue,
        isOpenCart,
        isOpenAddressModal,
        hasNewOrder,
        changeSnackbarStatus,
        changeSnackbarValues,
        changeSnackbarPosition,
        handleToggleOnNavbar,
        changeLayoutHidenStatus,
        changeConfirmationModalValues,
        changeLoadingStatus,
        changeOpenCartStatus,
        changeOpenFavoriteListStatus,
        changeOpenAddressModalStatus,
        changeHasNewOrderStatus,
    };
    return <LayoutContext.Provider value={layoutContextData}>{children}</LayoutContext.Provider>;
};

export default LayoutContextProvider;
