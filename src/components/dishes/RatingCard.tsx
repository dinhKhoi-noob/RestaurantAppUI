import { Avatar, Box, Card, CardContent, CardHeader, Rating, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { format } from "date-fns";
import React from "react";
import { DishRatingValue } from "../../contexts/DishContext";

const RatingCard = (props: DishRatingValue) => {
    const { avatar, comment, dateCreated, point, username } = props;
    const formatDate = "dd/MM/yyyy HH:mm";
    return (
        <Box m={1} ml={0} mr={0}>
            <Card>
                <CardHeader
                    avatar={
                        !avatar || avatar === "user_avatar" || avatar === "'user_avatar'" ? (
                            <Avatar sx={{ bgcolor: red[500] }}>{username[0]}</Avatar>
                        ) : (
                            <Avatar src={avatar}></Avatar>
                        )
                    }
                    title={username}
                    subheader={format(new Date(dateCreated), formatDate)}
                ></CardHeader>
                <CardContent>
                    <Rating value={point} />
                </CardContent>
                {comment && (
                    <CardContent>
                        <Typography>{comment}</Typography>
                    </CardContent>
                )}
            </Card>
        </Box>
    );
};

export default RatingCard;
