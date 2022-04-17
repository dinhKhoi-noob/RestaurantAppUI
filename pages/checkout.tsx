import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import NewAddressModal from "../src/components/auth/NewAddressModal";
import CartList from "../src/components/checkout/CartList";
import CheckoutForm from "../src/components/checkout/CheckoutForm";
import ConfirmationModal from "../src/components/layout/ConfirmationModal";
import { AuthContext } from "../src/contexts/AuthContext";
import { CartContext, CartItemValueInitializer } from "../src/contexts/CartContext";
import { OrderContext } from "../src/contexts/OrderContext";

const Checkout = () => {
    const cookie = new Cookies();
    const router = useRouter();
    const { userInfo, loadUserInfo, getCityNameApi, renderUserAddress } = useContext(AuthContext);
    const { orderItems, orderInfo, changeCurrentOrderId, loadSpecificOrder } = useContext(OrderContext);
    const { fillCarts, changeCheckoutInputValue } = useContext(CartContext);
    const [isManageMode, setIsManageMode] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    useEffect(() => {
        loadUserInfo();
        const queryId = router.query["id"];
        const id = typeof queryId === "string" && queryId.length > 0 ? queryId : null;
        if (id && id.length > 0) {
            loadSpecificOrder(id);
            setIsManageMode(true);
            changeCurrentOrderId(id);
        } else {
            if (cookie.get("o_id") && id?.length === 0) {
                loadSpecificOrder(cookie.get("o_id"));
                setIsManageMode(true);
                changeCurrentOrderId(id);
            }
        }
        getCityNameApi();
        renderUserAddress();
        return () => {
            cookie.remove("o_id");
            changeCheckoutInputValue({
                address: "select",
                name: "",
                phone: "",
            });
            fillCarts([]);
            changeCurrentOrderId("");
        };
    }, [router.query["id"]]);
    useEffect(() => {
        if (orderItems && orderInfo && orderItems.length > 0 && orderInfo.id.trim().length > 0 && isManageMode) {
            changeCheckoutInputValue({
                address: orderInfo.addressId,
                name: orderInfo.fullName,
                phone: orderInfo.phone,
            });
            const mappedCartItems: CartItemValueInitializer[] = orderItems.map(item => ({
                id: item.id,
                images: [item.thumbnail],
                price: item.price,
                quantity: item.quantity,
                title: item.productName,
            }));
            fillCarts(mappedCartItems);
        }
    }, [orderItems, orderInfo]);
    useEffect(() => {
        if (userInfo && userInfo.id.trim().length > 0 && userInfo.role === "customer") {
            setIsEditable(true);
        }
    }, [userInfo]);
    return (
        <>
            <ConfirmationModal />
            <NewAddressModal />
            <Grid container>
                <Grid item md={6} sm={12}>
                    <CartList />
                </Grid>
                <Grid item md={6} sm={12}>
                    <CheckoutForm
                        addressString={userInfo.address}
                        role={userInfo.role}
                        step={orderInfo.status}
                        isConfirmed={orderInfo.isConfirmed}
                        isEditable={isEditable}
                        isManageable={isManageMode}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default Checkout;
