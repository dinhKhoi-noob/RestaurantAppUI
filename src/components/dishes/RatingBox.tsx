import { Box, Button, FormControl, Rating, TextField } from "@mui/material";
import React, { SyntheticEvent, useContext } from "react";
import { DishContext } from "../../contexts/DishContext";
import { LayoutContext } from "../../contexts/LayoutContext";

const RatingBox = () => {
    const { dishRatingInput, changeRatingInput } = useContext(DishContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    const { comment, point } = dishRatingInput;
    const handleChangeRatingInput = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        changeRatingInput({ ...dishRatingInput, comment: target.value });
    };

    const handleOnSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        changeConfirmationModalValues({
            isToggle: true,
            type: "leaveComment",
            title: "Do you really want to rate this dish with these information?",
        });
    };

    return (
        <Box>
            <form
                onSubmit={event => {
                    handleOnSubmit(event);
                }}
            >
                <Box display="flex" flexDirection="column">
                    <Box mb={4}>
                        <Rating
                            value={point}
                            onChange={(event, newValue) => {
                                changeRatingInput({ ...dishRatingInput, point: newValue ? newValue : 0 });
                            }}
                        />
                    </Box>
                    <FormControl>
                        <TextField
                            multiline
                            rows={3}
                            value={comment}
                            placeholder="Leave some comment..."
                            onChange={event => {
                                handleChangeRatingInput(event);
                            }}
                        />
                    </FormControl>
                    <Box mt={4} mb={4} display="flex" justifyContent="flex-end">
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={event => {
                                handleOnSubmit(event);
                            }}
                        >
                            Rate
                        </Button>
                    </Box>
                </Box>
            </form>
        </Box>
    );
};

export default RatingBox;
