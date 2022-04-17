import React, { useContext, useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { CategoryContext, CategoryValueInitializer } from "../../src/contexts/CategoryContext";
import { Box, Button, Typography } from "@mui/material";
import { AiOutlinePlus } from "react-icons/ai";
import CategoryModal from "../../src/components/category/CategoryModal";
import ConfirmationModal from "../../src/components/layout/ConfirmationModal";
import { LayoutContext } from "../../src/contexts/LayoutContext";
const Category = () => {
    const { categories, loadAllCategories, changeOpenModalStatus, openEdittingModal, changeCurrentCategoryId } =
        useContext(CategoryContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    const [visibleCategories, setVisibleCategories] = useState<CategoryValueInitializer[]>([]);
    const [hiddenCategories, sethiddenCategories] = useState<CategoryValueInitializer[]>([]);

    useEffect(() => {
        loadAllCategories();
    }, []);

    useEffect(() => {
        const transitoryhiddenCategories: CategoryValueInitializer[] = categories
            .filter((category: CategoryValueInitializer) => {
                return category.isActive === false;
            })
            .map((category: CategoryValueInitializer) => {
                const { id, rootId, rootTitle, title } = category;
                const returnValues: CategoryValueInitializer = {
                    id,
                    rootId,
                    rootTitle,
                    title,
                    isActive: true,
                };
                return returnValues;
            });
        const transitoryVisibleCategories: CategoryValueInitializer[] = categories
            .filter((category: CategoryValueInitializer) => {
                return category.isActive === true;
            })
            .map((category: CategoryValueInitializer) => {
                const { id, rootId, rootTitle, title } = category;
                const returnValues: CategoryValueInitializer = {
                    id,
                    rootId,
                    rootTitle,
                    title,
                    isActive: true,
                };
                return returnValues;
            });
        setVisibleCategories(transitoryVisibleCategories);
        sethiddenCategories(transitoryhiddenCategories);
    }, [categories]);

    const handleChangeCategoryStatus = (isHide: boolean) => {
        changeConfirmationModalValues({
            isToggle: true,
            type: isHide ? "hideCategory" : "unhideCategory",
            title: `Do you want to ${isHide ? "hide" : "unhide"} this category ?`,
        });
    };

    const dataColumn: GridColDef[] = [
        { field: "id", headerName: "Id", width: 200 },
        { field: "title", headerName: "Title", width: 250 },
        { field: "rootId", headerName: "Root Id", width: 200 },
        { field: "rootTitle", headerName: "Root Title", width: 250 },
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
        { field: "rootId", headerName: "Root Id", width: 200 },
        { field: "rootTitle", headerName: "Root Title", width: 250 },
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

    return (
        <>
            <CategoryModal />
            <ConfirmationModal />
            <Box p={6}>
                <Typography variant="h4" textAlign="center">
                    Manage category list
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
                <Typography variant="h6" mt={3} mb={4}>
                    Available categories
                </Typography>
                <DataGrid
                    getRowId={row => row.id}
                    rows={visibleCategories}
                    columns={dataColumn}
                    disableSelectionOnClick
                    autoHeight
                    pagination
                    onCellClick={row => {
                        if (row.field === "edit") {
                            changeCurrentCategoryId(row.id.toString());
                            openEdittingModal(row.id.toString());
                        }
                        if (row.field === "hide") {
                            changeCurrentCategoryId(row.id.toString());
                            handleChangeCategoryStatus(true);
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
                {hiddenCategories.length > 0 && (
                    <>
                        <Typography variant="h6" mt={3} mb={4}>
                            Hidden categories
                        </Typography>
                        <DataGrid
                            getRowId={row => row.id}
                            rows={hiddenCategories}
                            columns={hiddenDataColumn}
                            disableSelectionOnClick
                            autoHeight
                            pagination
                            onCellClick={row => {
                                if (row.field === "edit") {
                                    openEdittingModal(row.id.toString());
                                    changeCurrentCategoryId(row.id.toString());
                                }
                                if (row.field === "hide") {
                                    changeCurrentCategoryId(row.id.toString());
                                    handleChangeCategoryStatus(false);
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

export default Category;
