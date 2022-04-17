import { Box, Button, SwipeableDrawer, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import NumberFormat from "react-number-format";
import { CartContext, CartItemValueInitializer } from "../../contexts/CartContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import CartRow from "../checkout/CartRow";

const Cart = () => {
    const router = useRouter();
    const { isOpenCart, changeOpenCartStatus } = useContext(LayoutContext);
    const { cartItems, storeCart } = useContext(CartContext);
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === "keydown" &&
            ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
        ) {
            return;
        }
        storeCart(cartItems);
        changeOpenCartStatus(open);
    };

    return (
        <SwipeableDrawer anchor="right" open={isOpenCart} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
            <Box
                style={{ backgroundColor: "white" }}
                sx={{ width: 450 }}
                role="presentation"
                p={4}
                pt={10}
                display="flex"
                flexDirection="column"
                height="100%"
            >
                <Box height="5%">
                    <Typography variant="h4" textAlign="center">
                        Your cart
                    </Typography>
                </Box>
                <Box height="85%" mt={5}>
                    {cartItems.map((item: CartItemValueInitializer, index: number) => {
                        const { id, images, price, quantity, title } = item;
                        return (
                            <CartRow
                                key={index}
                                id={id}
                                price={price}
                                quantity={quantity}
                                thumbnail={images && images.length > 0 ? images[0] : undefined}
                                title={title}
                            />
                        );
                    })}
                    {cartItems.length > 0 && (
                        <Box mt={5}>
                            <Box display="flex" alignItems="flex-end">
                                <Typography fontWeight="bold" variant="caption">
                                    Total:{" "}
                                </Typography>
                                &nbsp;
                                <Typography>
                                    <NumberFormat
                                        value={cartItems
                                            .map(item => item.price * item.quantity)
                                            .reduce((prev, next) => prev + next)}
                                        displayType="text"
                                        suffix="VND"
                                        thousandSeparator={true}
                                    />
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
                <Box height="10%" display="flex" justifyContent="center" alignItems="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            router.push("/checkout");
                        }}
                    >
                        Checkout
                    </Button>
                </Box>
            </Box>
        </SwipeableDrawer>
    );
};

export default Cart;
