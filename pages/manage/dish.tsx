import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import DishModal from "../../src/components/dishes/DishModal";
import ConfirmationModal from "../../src/components/layout/ConfirmationModal";
import Progress from "../../src/components/layout/Progress";
import { CategoryContext } from "../../src/contexts/CategoryContext";
import { DishContext, DishValueInitializer } from "../../src/contexts/DishContext";
import { LayoutContext } from "../../src/contexts/LayoutContext";

const Product = () => {
    const { dishes, loadAllDishes, changeOpenModalStatus, fillDishValue, changeCurrentDishId, changeSubmitType } =
        useContext(DishContext);
    const { loadAllCategories } = useContext(CategoryContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    const [visibledDishes, setVisibleDishes] = useState<DishValueInitializer[]>([]);
    const [hiddenDishes, setHiddenDishes] = useState<DishValueInitializer[]>([]);

    useEffect(() => {
        loadAllDishes(true);
        loadAllCategories();
    }, []);

    useEffect(() => {
        if (dishes.length > 0) {
            const transitoryVisibleDishes: DishValueInitializer[] = dishes.filter((dish: DishValueInitializer) => {
                return dish.isActive === true;
            });
            const transitoryHiddenDishes: DishValueInitializer[] = dishes.filter((dish: DishValueInitializer) => {
                return dish.isActive === false;
            });
            setVisibleDishes(transitoryVisibleDishes);
            setHiddenDishes(transitoryHiddenDishes);
        }
    }, [dishes]);

    const dataColumn: GridColDef[] = [
        { field: "id", headerName: "Id", width: 200 },
        { field: "title", headerName: "Title", width: 250 },
        { field: "price", headerName: "Price", width: 200 },
        { field: "categoryTitle", headerName: "Category Title", width: 250 },
        {
            field: "edit",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button onClick={() => {}} variant="contained" color="warning">
                        Edit
                    </Button>
                );
            },
        },
        {
            field: "hide",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button onClick={() => {}} variant="contained" color="error">
                        Hide
                    </Button>
                );
            },
        },
    ];

    const hiddenDataColumn: GridColDef[] = [
        { field: "id", headerName: "Id", width: 200 },
        { field: "title", headerName: "Title", width: 250 },
        { field: "price", headerName: "Price", width: 200 },
        { field: "categoryTitle", headerName: "Category Title", width: 250 },
        {
            field: "edit",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button onClick={() => {}} variant="contained" color="warning">
                        Edit
                    </Button>
                );
            },
        },
        {
            field: "hide",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button onClick={() => {}} variant="contained" color="error">
                        Unhide
                    </Button>
                );
            },
        },
    ];

    const handleChangeDishStatus = (isHide: boolean) => {
        changeConfirmationModalValues({
            isToggle: true,
            type: isHide ? "hideDish" : "unhideDish",
            title: `Do you really want to ${isHide ? "hide" : "unhide"} this dish ?`,
        });
    };

    return (
        <>
            <ConfirmationModal />
            <Progress />
            <DishModal />
            <Box p={6}>
                <Typography variant="h4" textAlign="center">
                    Manage dishes
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={3} mb={3}>
                    <Button
                        variant="contained"
                        color="success"
                        className="float-right"
                        endIcon={<AiOutlinePlus />}
                        onClick={() => {
                            changeOpenModalStatus(true);
                        }}
                    >
                        Add new category
                    </Button>
                </Box>
                <Box mt={2} mb={2} />
                <Box mt={2} mb={2} />
                <Typography variant="h6" mt={3} mb={4}>
                    Available dishes
                </Typography>
                <DataGrid
                    getRowId={row => row.id}
                    rows={visibledDishes}
                    columns={dataColumn}
                    disableSelectionOnClick
                    autoHeight
                    pagination
                    onCellClick={row => {
                        if (row.field === "edit") {
                            const id = row.id.toString();
                            changeCurrentDishId(id);
                            changeSubmitType("update");
                            fillDishValue(id);
                        }
                        if (row.field === "hide") {
                            changeCurrentDishId(row.id.toString());
                            handleChangeDishStatus(true);
                        }
                    }}
                    pageSize={10}
                    localeText={{
                        toolbarDensity: "Size",
                        toolbarDensityLabel: "Size",
                        toolbarDensityCompact: "Small",
                        toolbarDensityStandard: "Medium",
                        toolbarDensityComfortable: "Large",
                    }}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                />
                {hiddenDishes.length > 0 && (
                    <>
                        <Typography variant="h6" mt={3} mb={4}>
                            Hidden dishes
                        </Typography>
                        <DataGrid
                            getRowId={row => row.id}
                            rows={hiddenDishes}
                            columns={hiddenDataColumn}
                            disableSelectionOnClick
                            autoHeight
                            pagination
                            onCellClick={row => {
                                if (row.field === "edit") {
                                    const id = row.id.toString();
                                    changeCurrentDishId(id);
                                    changeSubmitType("update");
                                    fillDishValue(id);
                                }
                                if (row.field === "hide") {
                                    changeCurrentDishId(row.id.toString());
                                    handleChangeDishStatus(false);
                                }
                            }}
                            pageSize={10}
                            localeText={{
                                toolbarDensity: "Size",
                                toolbarDensityLabel: "Size",
                                toolbarDensityCompact: "Small",
                                toolbarDensityStandard: "Medium",
                                toolbarDensityComfortable: "Large",
                            }}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                        />
                    </>
                )}
            </Box>
        </>
    );
};

export default Product;
