/* eslint-disable react/no-children-prop */
import { Box, Button, FormLabel, Grid, Input, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import loginImage from "../public/assets/login-image.svg";
import { AuthContext, LoginUserValues } from "../src/contexts/AuthContext";
import { LayoutContext } from "../src/contexts/LayoutContext";

const Login = () => {
    const { changeLayoutHidenStatus } = useContext(LayoutContext);
    const { loginUser } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState<LoginUserValues>({
        username: "",
        password: "",
    });

    const submitLoginForm = (event: SyntheticEvent) => {
        event.preventDefault();
        loginUser(currentUser);
    };

    const changeCurrentUserInformation = (event: SyntheticEvent, inputFieldName: "username" | "password") => {
        const target = event.target as HTMLInputElement;
        if (inputFieldName === "username") {
            setCurrentUser({ ...currentUser, username: target.value });
            return;
        }
        setCurrentUser({ ...currentUser, password: target.value });
    };

    useEffect(() => {
        changeLayoutHidenStatus(true);
        return () => {
            changeLayoutHidenStatus(false);
        };
    }, []);
    return (
        <Grid container padding={3} pl={1} pr={1}>
            <Grid item sm={12} md={6} xl={6} lg={6} display="flex" justifyContent="center">
                <Image src={loginImage} />
            </Grid>
            <Grid item sm={12} md={6} xl={6} lg={6}>
                <Typography variant="h2" textAlign="center" fontSize={49} mt={3} mb={3}>
                    Đăng nhập
                </Typography>
                <form
                    onSubmit={event => {
                        submitLoginForm(event);
                    }}
                >
                    <FormLabel htmlFor="login-username" children={<Typography>Tên tài khoản</Typography>} />
                    <Input
                        id="login-username"
                        fullWidth
                        value={currentUser.username}
                        onChange={event => {
                            changeCurrentUserInformation(event, "username");
                        }}
                    />
                    <Box mt={1}></Box>
                    <br />
                    <FormLabel htmlFor="login-password" children={<Typography>Mật khẩu</Typography>} />
                    <Input
                        id="login-password"
                        type="password"
                        fullWidth
                        value={currentUser.password}
                        onChange={event => {
                            changeCurrentUserInformation(event, "password");
                        }}
                    />
                    <Box mt={3}></Box>
                    <Button variant="contained" type="submit" fullWidth>
                        Đăng nhập
                    </Button>
                    <Box display="flex" mt={2} justifyContent="center">
                        <Typography fontSize={14}>Chưa có tài khoản?</Typography>
                        <Box mr={1}></Box>
                        <Typography fontSize={14} fontWeight="bold" className="cursor-pointer">
                            <Link href="/register">Đăng ký</Link>
                        </Typography>
                    </Box>
                </form>
            </Grid>
        </Grid>
    );
};

export default Login;
