import { Grid } from "@mui/material";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { DishContext, DishImageValue, DishRatingValue, DishValueInitializer } from "../../contexts/DishContext";
import DishCard, { CardProps } from "./DishCard";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { CartContext, CartItemValueInitializer } from "../../contexts/CartContext";

const DishTable = () => {
    const { dishes, allDishImages, allDishRatings } = useContext(DishContext);
    const { favoriteList } = useContext(CartContext);
    const [dishList, setDishList] = useState<CardProps[]>([]);
    useEffect(() => {
        console.log(allDishRatings);
        if (dishes.length > 0 && allDishImages.length > 0) {
            const mappedDishList: CardProps[] = dishes.map((dish: DishValueInitializer) => {
                const { id, categoryTitle, price, title, description } = dish;
                const images = allDishImages
                    .filter((image: DishImageValue) => {
                        return image.dishId === id;
                    })
                    .map((image: DishImageValue) => image.url);
                const index = favoriteList.findIndex((item: CartItemValueInitializer) => item.id === id);
                const dishRating = allDishRatings.filter((rating: DishRatingValue) => {
                    return rating.dishId === id;
                });
                const ratePoint =
                    dishRating.length > 0
                        ? dishRating
                              .map((rating: DishRatingValue) => rating.point)
                              .reduce((prev, next) => prev + next) / dishRating.length
                        : 0;
                const returnValues: CardProps = {
                    id,
                    price,
                    title,
                    categoryTitle,
                    description,
                    images,
                    isAddedToFavorite: index > -1 ? true : false,
                    ratePoint,
                    totalRating: dishRating.length,
                };
                return returnValues;
            });
            setDishList(mappedDishList);
        }
    }, [dishes, allDishImages, favoriteList, allDishRatings]);
    const mapDishCard = (): ReactNode => {
        return dishList.map((value: CardProps, index: number) => {
            const { id, price, title, categoryTitle, description, images, isAddedToFavorite, ratePoint, totalRating } =
                value;
            return (
                <Grid item key={index}>
                    <DishCard
                        id={id}
                        price={price}
                        title={title}
                        categoryTitle={categoryTitle}
                        description={description}
                        images={images}
                        isAddedToFavorite={isAddedToFavorite}
                        ratePoint={ratePoint}
                        totalRating={totalRating}
                    />
                </Grid>
            );
        });
    };
    return <Grid container>{mapDishCard()}</Grid>;
};

export default DishTable;
