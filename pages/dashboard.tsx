import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { OrderContext } from "../src/contexts/OrderContext";

const Dashboard = () => {
    const { allOrderItems, orders, loadAllOrders, loadAllOrderItems } = useContext(OrderContext);
    // const [succeededOrders, setSucceededOrders] = useState<OrderValueInitializer[]>([]);
    useEffect(() => {
        loadAllOrders(
            undefined,
            new Date(new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() - 1)),
            new Date(Date.now())
        );
        loadAllOrderItems();
    }, []);
    useEffect(() => {}, [orders, allOrderItems]);
    return (
        <Box p={6}>
            <Typography variant="h3" textAlign="center">
                Dashboard
            </Typography>
            <Card color="#673ab7">
                <CardContent>
                    <Typography variant="h4"></Typography>
                    <Typography></Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Dashboard;
