import React, { ReactElement, useContext, useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { AuthContext } from "../src/contexts/AuthContext";
import { OrderContext, OrderValueInitializer } from "../src/contexts/OrderContext";
import { Box, Button, Chip } from "@mui/material";
import { format } from "date-fns";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";

type OverwritingColorType = "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined;

const MyOrder = () => {
    const router = useRouter();
    const cookie = new Cookies();
    const { userInfo, loadUserInfo } = useContext(AuthContext);
    const { orders, loadAllOrders } = useContext(OrderContext);
    const [mappedOrders, setMappedOrders] = useState<any[]>([]);
    const convertOrderStatus = (status: string): ReactElement => {
        let color: OverwritingColorType = "warning";
        switch (status) {
            case "unconfirmed":
                color = "default";
                break;
            case "cancel":
                color = "error";
                break;
            case "ready":
                color = "info";
                break;
            case "delivering":
                color = "primary";
                break;
            case "deliveried":
                color = "secondary";
                break;
            case "confirmed":
                color = "success";
                break;
            default:
                color = "warning";
        }
        return <Chip label={status} color={color} />;
    };
    const orderDataColumn: GridColDef[] = [
        { field: "id", headerName: "Id", width: 200 },
        { field: "fullName", headerName: "Ship to", width: 250 },
        { field: "phone", headerName: "Contact", width: 200 },
        { field: "total", headerName: "Total", width: 250 },
        { field: "dateCreated", headerName: "Created Date", width: 250 },
        { field: "status", headerName: "Status", width: 250, renderCell: params => params.value },
        {
            field: "view",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button variant="contained" color="secondary">
                        View
                    </Button>
                );
            },
        },
    ];
    useEffect(() => {
        loadUserInfo();
    }, []);

    useEffect(() => {
        if (userInfo && userInfo.id !== "") {
            loadAllOrders(userInfo.id);
        }
    }, [userInfo]);

    useEffect(() => {
        const transitoryOrders = orders.map((order: OrderValueInitializer) => {
            const { id, fullName, phone, total, dateCreated, status, isConfirmed } = order;
            return {
                id,
                fullName,
                phone,
                total,
                dateCreated: format(new Date(dateCreated), "dd/MM/yyyy HH:mm"),
                status: isConfirmed ? convertOrderStatus(status) : convertOrderStatus("unconfirmed"),
            };
        });
        setMappedOrders(transitoryOrders);
    }, [orders]);

    const navigateOrder = (id: string) => {
        cookie.remove("o_id");
        cookie.set("o_id", id);
        router.push(`/checkout?id=${id}`);
    };

    return (
        <Box>
            <DataGrid
                getRowId={row => row.id}
                rows={mappedOrders}
                columns={orderDataColumn}
                disableSelectionOnClick
                autoHeight
                pagination
                onCellClick={row => {
                    if (row.field === "view") {
                        navigateOrder(row.id.toString());
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
        </Box>
    );
};

export default MyOrder;
