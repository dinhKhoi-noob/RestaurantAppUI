import type { NextPage } from "next";
import React, { useContext, useEffect } from "react";
import DishTable from "../src/components/dishes/DishTable";
import { DishContext } from "../src/contexts/DishContext";

const Home: NextPage = () => {
    const { loadAllImages, loadAllDishes, loadAllRating } = useContext(DishContext);

    useEffect(() => {
        loadAllImages();
        loadAllDishes();
        loadAllRating();
    }, []);

    return (
        <>
            <DishTable />
        </>
    );
};

export default Home;
