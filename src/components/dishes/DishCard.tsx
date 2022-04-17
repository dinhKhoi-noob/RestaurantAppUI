/* eslint-disable react/no-children-prop */
/* eslint-disable no-unused-vars */
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse,
    IconButton,
    IconButtonProps,
    Rating,
    styled,
    Tooltip,
    Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Carousel } from "react-responsive-carousel";
import NoThumbnailImage from "../../../public/assets/default-thumbnail.jpeg";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { CartContext } from "../../contexts/CartContext";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

export interface CardProps {
    id: string;
    title: string;
    price: number;
    images: string[];
    description: string;
    categoryTitle: string;
    isAddedToFavorite: boolean;
    ratePoint: number;
    totalRating: number;
}

const DishCard = (props: CardProps) => {
    const router = useRouter();
    const cookie = new Cookies();
    const { id, title, price, images, description, categoryTitle, isAddedToFavorite, ratePoint, totalRating } = props;
    const [expanded, setExpanded] = useState(false);
    const { changeCurrentFavoriteItem, removeFavoriteItem } = useContext(CartContext);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card
            sx={{
                maxWidth: 310,
                height: 700,
                margin: 1,
                display: "flex",
                padding: "10px 0",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <CardHeader title={title} subheader={categoryTitle} sx={{ height: "20%" }} />
            <CardContent sx={{ height: "40%" }}>
                {images && images.length > 1 ? (
                    <Carousel showThumbs={false} showArrows={true} autoPlay={true} infiniteLoop={true} interval={8000}>
                        {images.map((image: string, index) => {
                            if (image && image.length > 0) {
                                return (
                                    <div>
                                        <img src={image} height="210px" style={{ objectFit: "cover" }} />
                                    </div>
                                );
                            }
                            return <Image src={NoThumbnailImage} key={index} />;
                        })}
                    </Carousel>
                ) : (
                    <Image src={NoThumbnailImage} />
                )}
            </CardContent>
            <CardContent sx={{ height: "25%", maxHeight: "30%" }}>
                {description.length > 200 ? (
                    <Typography variant="body2" color="text.secondary" className="scrollable">
                        <div
                            onClick={() => {
                                handleExpandClick();
                            }}
                        >
                            {description.slice(0, 200)}
                        </div>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <div
                                onClick={() => {
                                    handleExpandClick();
                                }}
                            >
                                {description.slice(200, description.length - 1)}
                            </div>
                        </Collapse>
                    </Typography>
                ) : (
                    description
                )}
            </CardContent>
            {totalRating > 0 ? (
                <CardContent sx={{ height: "5%" }}>
                    <Box display="flex">
                        <Rating name="disabled" value={ratePoint} precision={0.1} />
                        <Typography>({totalRating})</Typography>
                    </Box>
                </CardContent>
            ) : (
                <CardContent sx={{ height: "5%" }}>
                    <Box>
                        <Typography>No such any rating</Typography>
                    </Box>
                </CardContent>
            )}
            <CardContent>
                <Typography>Price: {price}</Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Box display="flex" justifyContent="space-between" width="100%" pr={2} pl={2}>
                    <IconButton aria-label="add to favorites">
                        {!isAddedToFavorite ? (
                            <Tooltip
                                title="Add to favorites"
                                onClick={() => {
                                    changeCurrentFavoriteItem({
                                        id,
                                        images,
                                        price,
                                        quantity: 0,
                                        title,
                                    });
                                }}
                            >
                                <AiOutlineHeart />
                            </Tooltip>
                        ) : (
                            <Tooltip
                                title="Remove to favorites"
                                onClick={() => {
                                    removeFavoriteItem(id);
                                }}
                            >
                                <AiFillHeart style={{ color: "red" }} />
                            </Tooltip>
                        )}
                    </IconButton>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            cookie.remove("d_id");
                            cookie.set("d_id", id);
                            router.push(`/dishes/details?id=${id}`);
                        }}
                    >
                        View more
                    </Button>
                </Box>
            </CardActions>
        </Card>
    );
};

export default DishCard;
