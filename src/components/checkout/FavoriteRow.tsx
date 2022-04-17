import { Box, Divider, Grid, Tooltip, Typography } from "@mui/material";
import React, { useContext } from "react";
import NumberFormat from "react-number-format";
import Image from "next/image";
import NoThumbnailImage from "../../../public/assets/default-thumbnail.jpeg";
import { CartContext } from "../../contexts/CartContext";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";

interface FavoriteRowProps {
    id: string;
    price: number;
    title: string;
    thumbnail: string | undefined;
}

const FavoriteRow = (props: FavoriteRowProps) => {
    const cookie = new Cookies();
    const router = useRouter();
    const { id, price, title, thumbnail } = props;
    const { removeFavoriteItem } = useContext(CartContext);
    const navigateToDish = (id: string) => {
        cookie.remove("d_id");
        cookie.set("d_id", id);
        router.push(`/dishes/details?id=${id}`);
    };
    return (
        <Box mt={1} mb={1}>
            <Tooltip title="Double click to remove">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid
                        item
                        md={4}
                        onDoubleClick={() => {
                            removeFavoriteItem(id);
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
                            removeFavoriteItem(id);
                        }}
                        item
                        md={7}
                        onClick={() => {
                            navigateToDish(id);
                        }}
                        className="cursor-pointer"
                    >
                        <Typography>{title}</Typography>
                        <Typography>
                            <NumberFormat value={price} thousandSeparator={true} displayType="text" />
                        </Typography>
                    </Grid>
                </Grid>
            </Tooltip>
            <Divider />
        </Box>
    );
};

export default FavoriteRow;
