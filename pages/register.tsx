/* eslint-disable react/no-children-prop */
import { Box, Button, FormLabel, Grid, Link, TextField, Typography } from "@mui/material";
import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import Image from "next/image";
import AdditionalInformation from "../src/components/auth/AdditionalInformation";
import { AuthContext, RegisterationTypingEvent } from "../src/contexts/AuthContext";
import loginImage from "../public/assets/login-image.svg";
import { LayoutContext } from "../src/contexts/LayoutContext";
const Register = () => {
    const { registerationValues, changeRegisterationValue, registerUser } = useContext(AuthContext);
    const { changeLayoutHidenStatus, changeSnackbarValues } = useContext(LayoutContext);
    const [retypePassword, setRetypePassword] = useState("");
    const { username, password, email, phone } = registerationValues;

    const checkPhoneNumber = () => {
        const regexPhone = /^((\+)84|0)[1-9](\d{2}){4}$/;
        const isValidPhone = regexPhone.test(phone);
        return isValidPhone;
    };

    const checkValidEmail = () => {
        const regexEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        const isValidEmail = regexEmail.test(email);
        return isValidEmail;
    };

    const checkPassword = () => {
        const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        const isStrongPassword = regexPassword.test(password);
        if (password !== retypePassword) {
            return { content: "Mật khẩu không trùng khớp", status: false };
        }

        if (!isStrongPassword) {
            return {
                content: "Mật khẩu phải dài hơn 8 ký tự, gồm ít nhất 1 chữ số, 1 chữ hoa và 1 chữ thường",
                status: false,
            };
        }
        return { content: "", status: true };
    };

    const onChangeRegistrationValue = (event: SyntheticEvent, type: RegisterationTypingEvent) => {
        const target = event.target as HTMLInputElement;
        switch (type) {
            case "username":
                changeRegisterationValue({ ...registerationValues, username: target.value });
                break;
            case "password":
                changeRegisterationValue({ ...registerationValues, password: target.value });
                break;
            case "email":
                changeRegisterationValue({ ...registerationValues, email: target.value });
                break;
            case "phone":
                changeRegisterationValue({ ...registerationValues, phone: target.value });
                break;
            default:
                break;
        }
    };
    const submitRegisterForm = (event: SyntheticEvent) => {
        event.preventDefault();
        const passwordStatus = checkPassword();
        const phoneStatus = checkPhoneNumber();
        const emailStatus = checkValidEmail();
        if (!phoneStatus) {
            changeSnackbarValues({
                content: "Số điện thoại không hợp lệ, số điện thoại phải dài 10 chữ số và bắt đầu từ 0",
                type: "error",
                isToggle: true,
            });
            return;
        }
        if (!passwordStatus?.status) {
            changeSnackbarValues({ content: passwordStatus.content, type: "error", isToggle: true });
            return;
        }
        if (!emailStatus) {
            changeSnackbarValues({ content: "Email không hợp lệ", type: "error", isToggle: true });
        }
        registerUser(registerationValues);
    };

    useEffect(() => {
        changeLayoutHidenStatus(true);
        return () => {
            changeLayoutHidenStatus(false);
        };
    }, []);

    return (
        <Grid container padding={3} pl={1} pr={1}>
            <Grid item sm={12} md={6} xl={6} display="flex" alignItems="flex-start" justifyContent="center">
                <Image src={loginImage} />
            </Grid>
            <Grid item sm={12} md={6} xl={6}>
                <Typography variant="h2" textAlign="center" fontSize={49} mt={3} mb={3}>
                    Đăng ký
                </Typography>
                <form
                    onSubmit={event => {
                        submitRegisterForm(event);
                    }}
                >
                    <FormLabel htmlFor="register-username" children={<Typography>Tên tài khoản</Typography>} />
                    <TextField
                        id="register-username"
                        helperText="Tên người dùng phải dài tối thiểu 1 ký tự và phải là duy nhất"
                        fullWidth
                        value={username}
                        onChange={event => {
                            onChangeRegistrationValue(event, "username");
                        }}
                    />
                    <Box mt={1}></Box>
                    <br />
                    <FormLabel
                        htmlFor="register-password"
                        children={<Typography>Mật khẩu</Typography>}
                        autoCorrect="off"
                    />
                    <TextField
                        id="register-password"
                        type="password"
                        helperText="Mật khẩu phải dài tối thiểu 8 ký tự và chứa ít nhất 1 chữ cái viết thường, 1 chữ cái viết hoa và 1 số"
                        fullWidth
                        value={password}
                        onChange={event => {
                            onChangeRegistrationValue(event, "password");
                        }}
                    />
                    <Box mt={1}></Box>
                    <br />
                    <FormLabel
                        htmlFor="register-confirm-password"
                        children={<Typography>Xác nhận mật khẩu</Typography>}
                    />
                    <TextField
                        id="register-confirm-password"
                        type="password"
                        helperText="Mật khẩu phải trùng khớp"
                        fullWidth
                        value={retypePassword}
                        onChange={(event: SyntheticEvent) => {
                            const target = event.target as HTMLInputElement;
                            setRetypePassword(target.value);
                        }}
                    />
                    <Box mt={2}></Box>
                    <FormLabel htmlFor="register-email" children={<Typography>Email</Typography>} />
                    <TextField
                        id="register-email"
                        fullWidth
                        helperText="Ví dụ: nguyenvana@test.com"
                        value={email}
                        onChange={(event: SyntheticEvent) => {
                            const target = event.target as HTMLInputElement;
                            changeRegisterationValue({ ...registerationValues, email: target.value });
                        }}
                    />
                    <Box mt={1}></Box>
                    <br />
                    <AdditionalInformation />
                    <Box mt={3}></Box>
                    <Button variant="contained" fullWidth type="submit">
                        Đăng ký ngay
                    </Button>
                    <Box display="flex" mt={2} justifyContent="center">
                        <Typography fontSize={14}>Đã có tài khoản?</Typography>
                        <Box mr={1}></Box>
                        <Typography fontSize={14} fontWeight="bold" className="cursor-pointer">
                            <Link href="/login">Đăng nhập</Link>
                        </Typography>
                    </Box>
                </form>
            </Grid>
        </Grid>
    );
};

export default Register;
