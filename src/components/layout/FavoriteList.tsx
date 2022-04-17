import { Box, SwipeableDrawer, Typography } from "@mui/material";
import React, { useContext } from "react";
import { CartContext, CartItemValueInitializer } from "../../contexts/CartContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import FavoriteRow from "../checkout/FavoriteRow";

const FavoriteList = () => {
    const { isOpenFavoriteList, changeOpenFavoriteListStatus } = useContext(LayoutContext);
    const { favoriteList } = useContext(CartContext);
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === "keydown" &&
            ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
        ) {
            return;
        }
        // storeCart(cartItems);
        changeOpenFavoriteListStatus(open);
    };
    return (
        <SwipeableDrawer
            anchor="right"
            open={isOpenFavoriteList}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
        >
            <Box
                style={{ backgroundColor: "white" }}
                sx={{ width: 350 }}
                role="presentation"
                p={4}
                pt={10}
                display="flex"
                flexDirection="column"
                height="100%"
            >
                <Box height="5%">
                    <Typography variant="h4" textAlign="center">
                        Your favorite list
                    </Typography>
                </Box>
                <Box height="85%" mt={5}>
                    {favoriteList.map((item: CartItemValueInitializer, index: number) => {
                        const { id, images, price, title } = item;
                        return (
                            <FavoriteRow
                                key={index}
                                id={id}
                                price={price}
                                thumbnail={images && images.length > 0 ? images[0] : undefined}
                                title={title}
                            />
                        );
                    })}
                </Box>
            </Box>
        </SwipeableDrawer>
    );
};

export default FavoriteList;
