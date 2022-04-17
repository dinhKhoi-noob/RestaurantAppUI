import { Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import NumberFormat from "react-number-format";
import { CartContext, CartItemValueInitializer } from "../../contexts/CartContext";
import CartRow from "./CartRow";

const CartList = () => {
    const { cartItems, transitoryCart } = useContext(CartContext);
    const targetCart = transitoryCart.length > 0 ? transitoryCart : cartItems;
    return (
        <Box>
            <Typography variant="h5">Your cart</Typography>
            <Box p={5}>
                {targetCart.length > 0 ? (
                    targetCart.map((item: CartItemValueInitializer, index: number) => {
                        const { id, images, price, quantity, title } = item;
                        return (
                            <Box m={3} mr={0} ml={0} key={index}>
                                <CartRow
                                    id={id}
                                    price={price}
                                    quantity={quantity}
                                    thumbnail={images && images.length > 0 ? images[0] : undefined}
                                    title={title}
                                    isOnEdit={transitoryCart.length > 0 ? true : undefined}
                                />
                            </Box>
                        );
                    })
                ) : (
                    <Typography marginTop={6}>You did not add any dish to your cart</Typography>
                )}
            </Box>
            {targetCart.length > 0 && (
                <Box>
                    <Box display="flex" alignItems="flex-end">
                        <Typography fontWeight="bold" variant="caption">
                            Total:{" "}
                        </Typography>
                        &nbsp;
                        <Typography>
                            <NumberFormat
                                value={targetCart
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
    );
};

export default CartList;
