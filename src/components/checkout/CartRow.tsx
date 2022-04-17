import { Box, Divider, Grid, TextField, Tooltip, Typography } from "@mui/material";
import React, { useContext } from "react";
import Image from "next/image";
import NoThumbnailImage from "../../../public/assets/default-thumbnail.jpeg";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import NumberFormat from "react-number-format";
import { CartContext } from "../../contexts/CartContext";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
interface CardRowProps {
    id: string;
    quantity: number;
    price: number;
    title: string;
    thumbnail: string | undefined;
    isOnEdit?: boolean;
}

const CartRow = (props: CardRowProps) => {
    const router = useRouter();
    const cookie = new Cookies();
    const { changeDishQuantity, removeCartItem } = useContext(CartContext);
    const { quantity, price, title, thumbnail, id, isOnEdit } = props;
    const navigateToDish = (id: string) => {
        cookie.remove("d_id");
        cookie.set("d_id", id);
        router.push(`/dishes/details?id=${id}`);
    };
    return (
        <>
            <Tooltip title="Double click to remove">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid
                        item
                        md={1.8}
                        onDoubleClick={() => {
                            isOnEdit !== undefined && isOnEdit ? removeCartItem(id, true) : removeCartItem(id);
                        }}
                    >
                        {thumbnail ? (
                            <img src={thumbnail} style={{ width: "100%", height: "60px", objectFit: "cover" }} />
                        ) : (
                            <Image src={NoThumbnailImage} width={125} height={100} />
                        )}
                    </Grid>
                    <Grid
                        onDoubleClick={() => {
                            removeCartItem(id);
                        }}
                        item
                        md={4}
                        onClick={() => {
                            navigateToDish(id);
                        }}
                        className="cursor-pointer"
                    >
                        <Typography>{title}</Typography>
                        <Typography>
                            <NumberFormat value={price} thousandSeparator={true} displayType="text" suffix="VND" />
                        </Typography>
                    </Grid>
                    <Grid item md={2.5}>
                        <Box display="flex" width="100%" alignItems="center" justifyContent="space-between">
                            <AiFillMinusCircle
                                onClick={event => {
                                    isOnEdit
                                        ? changeDishQuantity(event, id, -1, true)
                                        : changeDishQuantity(event, id, -1);
                                }}
                            />
                            <TextField
                                sx={{ width: "60px" }}
                                size="small"
                                value={quantity}
                                onChange={event => {
                                    isOnEdit
                                        ? changeDishQuantity(event, id, undefined, true)
                                        : changeDishQuantity(event, id);
                                }}
                            />
                            <AiFillPlusCircle
                                onClick={event => {
                                    isOnEdit
                                        ? changeDishQuantity(event, id, 1, true)
                                        : changeDishQuantity(event, id, 1);
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid
                        item
                        md={2.4}
                        onDoubleClick={() => {
                            removeCartItem(id);
                        }}
                    >
                        <Typography>
                            <NumberFormat
                                value={price * quantity}
                                thousandSeparator={true}
                                displayType="text"
                                suffix="VND"
                            />
                        </Typography>
                    </Grid>
                </Grid>
            </Tooltip>
            <Divider />
        </>
    );
};

export default CartRow;
