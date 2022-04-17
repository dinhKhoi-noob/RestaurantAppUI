import { Box, Button, Grid, Rating, TextField, Typography } from "@mui/material";
import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { Carousel } from "react-responsive-carousel";
import NoThumbnailImage from "../../public/assets/default-thumbnail.jpeg";
import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoCartOutline } from "react-icons/io5";
import { DishContext, DishImageValue, DishRatingValue } from "../../src/contexts/DishContext";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import NumberFormat from "react-number-format";
import { CartContext, CartItemValueInitializer } from "../../src/contexts/CartContext";
import RatingCard from "../../src/components/dishes/RatingCard";
import { AuthContext } from "../../src/contexts/AuthContext";
import RatingBox from "../../src/components/dishes/RatingBox";
import ConfirmationModal from "../../src/components/layout/ConfirmationModal";

interface RatingValue {
    total: number;
    point: number;
}

const Details = () => {
    const router = useRouter();
    const cookie = new Cookies();
    const {
        specificDishInfo,
        specificDishImages,
        dishRatings,
        currentDishId,
        loadSpecificDishImages,
        loadSpecificDishInformation,
        loadSpecificDishRating,
        changeCurrentDishId,
        resetData,
    } = useContext(DishContext);
    const { userInfo, loadUserInfo } = useContext(AuthContext);
    const { cartItems, currentCartItem, changeCurrentCartItem, addToCart, loadCarts } = useContext(CartContext);
    const [isRated, setIsRated] = useState(false);
    const [commentIndex, setCommentIndex] = useState(1);
    const [rateValue, setRateValue] = useState<RatingValue>({
        total: 0,
        point: 0,
    });

    useEffect(() => {
        const queryId = router.query["id"];
        const id = typeof queryId === "string" ? queryId : cookie.get("d_id");
        if (id) {
            loadCarts();
            loadUserInfo();
            loadSpecificDishImages(id);
            loadSpecificDishInformation(id);
            loadSpecificDishRating(id);
            changeCurrentDishId(id);
        }
        return () => {
            resetData();
            setRateValue({
                point: 0,
                total: 0,
            });
            setIsRated(false);
        };
    }, [router.query["id"]]);

    useEffect(() => {
        if (specificDishInfo && specificDishImages && cartItems) {
            console.log(specificDishInfo);
            const { id, price, title } = specificDishInfo;
            const index = cartItems.findIndex((cart: CartItemValueInitializer) => cart.id === specificDishInfo.id);
            if (index >= 0) {
                changeCurrentCartItem({
                    id,
                    price,
                    title,
                    quantity: cartItems[index].quantity,
                    images: specificDishImages.map(image => image.url),
                });
            } else {
                changeCurrentCartItem({
                    id,
                    price,
                    title,
                    quantity: 0,
                    images: specificDishImages.map(image => image.url),
                });
            }
        }
        if (dishRatings.length > 0 && userInfo && dishRatings[0].dishId === currentDishId) {
            const index = dishRatings.findIndex((item: DishRatingValue) => item.userId === userInfo.id);
            const ratePoint =
                dishRatings.length > 0
                    ? dishRatings.map((rating: DishRatingValue) => rating.point).reduce((prev, next) => prev + next) /
                      dishRatings.length
                    : 0;
            console.log(ratePoint);
            setRateValue({
                point: ratePoint,
                total: dishRatings.length,
            });
            if (index > -1) {
                setIsRated(true);
            }
        }
    }, [specificDishInfo, specificDishImages, cartItems, dishRatings, userInfo]);

    const handleChangeDishQuantity = (event: SyntheticEvent, quantity?: number) => {
        const target = event.target as HTMLInputElement;
        const value = parseInt(target.value);
        if (quantity) {
            if (currentCartItem.quantity > 0 && quantity < 0) {
                changeCurrentCartItem({ ...currentCartItem, quantity: currentCartItem.quantity + quantity });
                return;
            }
            if (quantity > 0) {
                changeCurrentCartItem({ ...currentCartItem, quantity: currentCartItem.quantity + quantity });
            }
            return;
        }
        if (target.value.length === 0) {
            changeCurrentCartItem({ ...currentCartItem, quantity: 0 });
            return;
        }
        if (!isNaN(value)) {
            changeCurrentCartItem({ ...currentCartItem, quantity: value });
            return;
        }
    };

    const handleAddToCart = () => {
        addToCart();
    };

    const loadMore = () => {
        setCommentIndex(commentIndex + 1);
    };

    return (
        <Box p={6}>
            <ConfirmationModal />
            <Grid container>
                <Grid item md={6} sm={12} mt={5} mb={6}>
                    <Typography variant="h5">{specificDishInfo?.title}</Typography>
                    <Typography variant="caption">{specificDishInfo?.categoryTitle}</Typography>
                    <br />
                    <Box display="flex">
                        <Rating name="disabled" value={rateValue.point} precision={0.1} />
                        <Typography>({rateValue.total})</Typography>
                    </Box>
                    <Box display="flex" mt={3} mb={3} alignItems="center">
                        <Typography>Price:</Typography>&nbsp;
                        <Typography>
                            <NumberFormat
                                displayType="text"
                                value={specificDishInfo?.price}
                                thousandSeparator={true}
                                suffix="VND"
                            />
                        </Typography>
                    </Box>
                    <Typography>
                        {specificDishInfo?.description && specificDishInfo.description.length < 30 ? (
                            <>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                                mollit anim id est laborum
                            </>
                        ) : (
                            specificDishInfo?.description
                        )}
                    </Typography>
                    <Box display="flex" justifyContent="space-around" alignItems="center" mt={4}>
                        <Box display="flex" alignItems="center">
                            <Typography>Quantity:</Typography>&nbsp;
                            <Box display="flex" width="130px" alignItems="center" justifyContent="space-between">
                                <AiFillMinusCircle
                                    onClick={event => {
                                        handleChangeDishQuantity(event, -1);
                                    }}
                                />
                                <TextField
                                    sx={{ width: "100px" }}
                                    size="small"
                                    value={currentCartItem.quantity}
                                    onChange={event => {
                                        handleChangeDishQuantity(event);
                                    }}
                                />
                                <AiFillPlusCircle
                                    onClick={event => {
                                        handleChangeDishQuantity(event, 1);
                                    }}
                                />
                            </Box>
                        </Box>
                        <Box alignItems="center">
                            <Button
                                variant="contained"
                                color="secondary"
                                endIcon={<IoCartOutline />}
                                size="large"
                                onClick={() => {
                                    handleAddToCart();
                                }}
                            >
                                Add to card
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid md={6} sm={12}>
                    {specificDishImages && specificDishImages.length > 1 ? (
                        <Carousel
                            showThumbs={false}
                            showArrows={true}
                            autoPlay={true}
                            infiniteLoop={true}
                            interval={8000}
                        >
                            {specificDishImages.map((value: DishImageValue, index) => {
                                const image = value.url;
                                if (image && image.length > 0) {
                                    return (
                                        <div style={{ width: "100%" }}>
                                            <img src={image} height={400} width="100%" style={{ objectFit: "cover" }} />
                                        </div>
                                    );
                                }
                                return <Image src={NoThumbnailImage} key={index} />;
                            })}
                        </Carousel>
                    ) : (
                        <Image src={NoThumbnailImage} />
                    )}
                </Grid>
            </Grid>
            {!isRated && <RatingBox />}
            {dishRatings.length > 0 && (
                <Box mt={8}>
                    <Typography variant="h6" mb={5}>
                        All rating
                    </Typography>
                    {dishRatings.map((dish: DishRatingValue, index: number) => {
                        const { avatar, comment, dateCreated, dishId, id, point, userId, username } = dish;
                        return (
                            index <= commentIndex && (
                                <RatingCard
                                    key={index}
                                    avatar={avatar}
                                    comment={comment}
                                    id={id}
                                    dateCreated={dateCreated}
                                    point={point}
                                    userId={userId}
                                    dishId={dishId}
                                    username={username}
                                />
                            )
                        );
                    })}
                    <Box mt={2} mb={2} />
                    {dishRatings.length > commentIndex + 1 && (
                        <Button variant="contained" color="secondary" onClick={() => loadMore()}>
                            Load More
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default Details;
