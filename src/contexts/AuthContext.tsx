/* eslint-disable camelcase */
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { createContext, ReactNode, SyntheticEvent, useContext, useEffect, useReducer, useState } from "react";
import Cookies from "universal-cookie";
import authReducer, { AuthReducerState } from "../reducer/authReducer";
import { LayoutContext } from "./LayoutContext";

type AddressPickerType = "city" | "district" | "ward" | "address";
type AddressTypingType = "street" | "level";
export type RegisterationTypingEvent = "username" | "password" | "phone" | "email";
interface AuthContextProps {
    children: ReactNode;
}

export interface LoginUserValues {
    username: string;
    password: string;
}

export interface RegisterUserValues {
    username: string;
    password: string;
    phone: string;
    address: string;
    email: string;
}

export interface UserInformationValues {
    id: string;
    username: string;
    avatar: string;
    email: string;
    phone: string;
    address: string;
    role: string;
}

interface UserAddress {
    city: string;
    district: string;
    ward: string;
    street: string;
    level: string;
    cityCode: string;
    districtCode: string;
    wardCode: string;
}

export interface UserAddressValue {
    id: string;
    address: string;
}

interface AuthContextValues {
    userInfo: UserInformationValues;
    cities: any[];
    districtSelection: any[];
    wardSelection: any[];
    userAddress: UserAddress | undefined;
    registerationValues: RegisterUserValues;
    addressList: UserAddressValue[];
    loadUserInfo: () => void;
    getCityNameApi: () => void;
    renderAddressSelector: (type: AddressPickerType, selector: any[]) => void;
    changeAddressLineOne: (event: SyntheticEvent, type: AddressTypingType) => void;
    changeRegisterationValue: (user: RegisterUserValues) => void;
    registerUser: (user: RegisterUserValues) => void;
    loginUser: (user: LoginUserValues) => void;
    loggoutUser: () => void;
    renderUserAddress: () => void;
    addNewAddress: (address: string, uid: string) => void;
    renderTransactionAddressSelector: () => ReactNode;
    isExipiredLogin: () => void;
}

const authContextDefaultValues: AuthContextValues = {
    userInfo: {
        avatar: "",
        username: "",
        phone: "",
        address: "",
        email: "",
        id: "",
        role: "",
    },
    cities: [],
    districtSelection: [],
    wardSelection: [],
    addressList: [],
    userAddress: undefined,
    registerationValues: {
        username: "",
        password: "",
        phone: "",
        address: "",
        email: "",
    },
    loadUserInfo: () => null,
    getCityNameApi: () => null,
    renderAddressSelector: () => null,
    changeAddressLineOne: () => null,
    changeRegisterationValue: () => null,
    registerUser: () => null,
    loginUser: () => null,
    loggoutUser: () => null,
    addNewAddress: () => null,
    renderUserAddress: () => null,
    renderTransactionAddressSelector: () => null,
    isExipiredLogin: () => null,
};

export const AuthContext = createContext<AuthContextValues>(authContextDefaultValues);

const AuthContextProvider = ({ children }: AuthContextProps) => {
    const host = "http://localhost:4000";
    const router = useRouter();
    const cookie = new Cookies();
    const { changeSnackbarValues } = useContext(LayoutContext);
    const authStateDefault: AuthReducerState = {
        userInfo: {
            avatar: "",
            username: "",
            phone: "",
            address: "",
            email: "",
            id: "",
            role: "",
        },
        registerationValues: {
            username: "",
            password: "",
            phone: "",
            address: "",
            email: "",
        },
        addressList: [],
    };
    const [authState, dispatch] = useReducer(authReducer, authStateDefault);
    const { userInfo, registerationValues, addressList } = authState;
    const [cities, setCities] = useState<any[]>([]);
    const [districtSelection, setDistrictSelection] = useState<any[]>([]);
    const [wardSelection, setWardSelection] = useState<any[]>([]);
    const [loadSelector, setLoadSelector] = useState(false);
    const [userAddress, setUserAddress] = useState<UserAddress>({
        city: "",
        district: "",
        ward: "",
        street: "",
        level: "",
        cityCode: "",
        districtCode: "",
        wardCode: "",
    });
    useEffect(() => {
        if (router.pathname === "/profile" && !loadSelector) {
            renderDistrictEditingSelector();
        }
    }, [districtSelection]);

    useEffect(() => {
        if (router.pathname === "/profile" && !loadSelector) {
            renderWardEditingSelector();
            setLoadSelector(true);
        }
    }, [wardSelection]);

    const handleError = (error: any) => {
        if (axios.isAxiosError(error)) {
            changeSnackbarValues({
                content: error.response?.data.message,
                isToggle: true,
                type: "error",
            });
            return;
        }
        changeSnackbarValues({
            content: "Lỗi hệ thống",
            isToggle: true,
            type: "error",
        });
    };

    const storeUserLoginInformation = async () => {
        if (typeof window !== "undefined") {
            const uid = cookie.get("uid");
            try {
                const response = await axios.get(`${host}/api/auth/${uid}`);
                const userData = response.data.user;
                if (userData) {
                    console.log(userData);
                    const { role, username, address, avatar, phone, email, visible_id } = userData;
                    const userInfo: UserInformationValues = {
                        id: visible_id,
                        role,
                        username,
                        address,
                        phone,
                        email,
                        avatar,
                    };
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));
                    dispatch({ type: "userInfo", payload: userInfo });
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status !== 404) {
                    handleError(error);
                }
            }
        }
    };

    const setCookie = async (providedToken?: string) => {
        const token = providedToken ? providedToken : router.query["token"];
        try {
            if (token) {
                const response = await axios.post(`${host}/api/auth/verify`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response?.data.user) {
                    const id = response?.data?.user.visible_id;
                    console.log(response?.data);
                    cookie.set("uid", id, {
                        path: "/",
                        expires: new Date(new Date().setDate(new Date().getDate() + 1)),
                    });
                    storeUserLoginInformation();
                    router.push("/");
                }
            }
        } catch (error) {
            handleError(error);
        }
    };

    const renderDistrictEditingSelector = () => {
        const addressSelectorCode = userInfo?.address.split("!^!")[1];
        if (addressSelectorCode) {
            const addressSelectorCodeArray = addressSelectorCode.split("&");
            if (addressSelectorCodeArray[1]) {
                setUserAddress({
                    ...userAddress,
                    district: districtSelection[parseInt(addressSelectorCodeArray[1].split("_")[0])]["name"],
                    wardCode: addressSelectorCodeArray[2],
                });
                setWardSelection(districtSelection[parseInt(addressSelectorCodeArray[1].split("_")[0])]["wards"]);
            }
        }
    };

    const renderWardEditingSelector = () => {
        const addressSelectorCode = userInfo?.address.split("!^!")[1];
        if (addressSelectorCode) {
            const addressSelectorCodeArray = addressSelectorCode.split("&");
            if (addressSelectorCodeArray[2]) {
                setUserAddress({
                    ...userAddress,
                    ward: wardSelection[parseInt(addressSelectorCodeArray[2].split("_")[0])]["name"],
                });
            }
        }
    };

    const changeAddress = (event: SelectChangeEvent, type: AddressPickerType) => {
        const value = event.target.value;
        const valueId = parseInt(value.split("_")[0]);
        console.log(value);
        switch (type) {
            case "city":
                setUserAddress({
                    ...userAddress,
                    cityCode: value,
                    city: cities[valueId]["name"],
                });
                setDistrictSelection(cities[valueId]["districts"]);
                setWardSelection([]);
                break;
            case "district":
                setUserAddress({
                    ...userAddress,
                    districtCode: value,
                    district: districtSelection[valueId]["name"],
                });
                setWardSelection(districtSelection[valueId]["wards"]);
                break;
            case "ward":
                setUserAddress({
                    ...userAddress,
                    wardCode: value,
                    ward: wardSelection[valueId]["name"],
                });
                break;
            default:
                return;
        }
    };

    const changeAddressLineOne = (event: SyntheticEvent, type: AddressTypingType) => {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        if (type === "street") {
            setUserAddress({ ...userAddress, street: value });
            return;
        }
        setUserAddress({ ...userAddress, level: value });
    };

    const renderAddressSelector = (type: AddressPickerType, selector: any[]) => {
        let labelText = "";
        let labelId = "";
        let selectId = "";
        let codeType;
        if (type === "city") {
            labelText = "Tỉnh / Thành Phố";
            labelId = "city-selector-label";
            selectId = "city-selector";
            codeType = userAddress.cityCode;
        }
        if (type === "district") {
            labelText = "Quận / Huyện / Thị xã";
            labelId = "district-selector-label";
            selectId = "district-selector";
            codeType = userAddress.districtCode;
        }
        if (type === "ward") {
            labelText = "Phường / Xã / Thị trấn";
            labelId = "district-selector-label";
            selectId = "district-selector";
            codeType = userAddress.wardCode;
        }
        return (
            <FormControl fullWidth>
                <InputLabel id={labelId}>{labelText}</InputLabel>
                <Select labelId={labelId} id={selectId} value={codeType} onChange={event => changeAddress(event, type)}>
                    {selector.map((district, index) => {
                        return (
                            <MenuItem key={index} value={index + "_" + type}>
                                {district["name"]}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        );
    };

    const getCityNameApi = async () => {
        try {
            const response = await axios.get("https://provinces.open-api.vn/api/?depth=3");
            const cities = response?.data;
            setCities(cities);
        } catch (error) {
            console.log(error);
        }
    };

    const loadUserInfo = () => {
        if (typeof window !== "undefined") {
            const temporaryInfo = window.localStorage.getItem("userInfo");
            console.log(temporaryInfo);
            if (temporaryInfo) {
                const userInfo = JSON.parse(temporaryInfo);
                const { username, id, avatar, email, phone, address, role } = userInfo;
                const savedUserValues: UserInformationValues = {
                    id,
                    username,
                    avatar,
                    email,
                    phone,
                    address,
                    role,
                };
                dispatch({ type: "userInfo", payload: savedUserValues });
            }
        }
    };

    const registerUser = async (user: RegisterUserValues) => {
        const { city, district, ward, street, level, cityCode, districtCode, wardCode } = userAddress;
        const { username, password, phone, email } = user;
        const currentAddress =
            level +
            ", " +
            street +
            ", " +
            ward +
            ", " +
            district +
            ", " +
            city +
            "!^!" +
            cityCode +
            "&" +
            districtCode +
            "&" +
            wardCode;
        user.address = currentAddress;
        try {
            const response = await axios.post(`${host}/api/auth/register`, {
                username,
                password,
                email,
                address: currentAddress,
                phone,
            });
            if (response.data.token) {
                setCookie(response.data.token);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const loginUser = async (user: LoginUserValues) => {
        try {
            const response = await axios.post(`${host}/api/auth/login`, user);
            if (response.data.token) {
                const token = response.data.token;
                setCookie(token);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const loggoutUser = () => {
        if (typeof window !== "undefined") {
            cookie.remove("uid");
            localStorage.removeItem("userInfo");
            localStorage.removeItem("cart");
            localStorage.removeItem("favorite");
            router.push("/login");
        }
    };

    const isExipiredLogin = () => {
        const id = cookie.get("uid");
        if (!id || id === "") {
            router.push("/login");
            localStorage.removeItem("userInfo");
            localStorage.removeItem("cart");
            localStorage.removeItem("favorite");
        }
    };

    const changeRegisterationValue = (user: RegisterUserValues) => {
        dispatch({ type: "changeRegisterationValue", payload: user });
    };

    const renderUserAddress = async () => {
        try {
            const id = cookie.get("uid");
            console.log(`${host}/api/address/${id}`);
            const response = await axios.get(`${host}/api/address/${id}`);
            const result: any[] = response.data.result;
            if (result) {
                const mappedAddressList: UserAddressValue[] = result.map((value: any) => {
                    const { id, address } = value;
                    return {
                        id,
                        address,
                    };
                });
                dispatch({ type: "loadAddress", payload: mappedAddressList });
            }
        } catch (error) {
            handleError(error);
        }
    };

    const addNewAddress = async (address: string, uid: string) => {
        try {
            console.log(address);
            await axios.post(`${host}/api/address/${uid}`, { address });
            renderUserAddress();
            changeSnackbarValues({
                content: "New address was added",
                isToggle: true,
                type: "success",
            });
            setUserAddress({
                city: "",
                district: "",
                ward: "",
                street: "",
                level: "",
                cityCode: "",
                districtCode: "",
                wardCode: "",
            });
        } catch (error) {
            handleError(error);
        }
    };

    const renderTransactionAddressSelector = (): ReactNode => {
        return addressList.map((item: UserAddressValue, index) => {
            return (
                <MenuItem key={index} value={item.id}>
                    {item.address.split("!^!")[0]}
                </MenuItem>
            );
        });
    };

    const authContextData: AuthContextValues = {
        userInfo,
        cities,
        districtSelection,
        wardSelection,
        userAddress,
        registerationValues,
        addressList,
        loadUserInfo,
        getCityNameApi,
        changeAddressLineOne,
        renderAddressSelector,
        changeRegisterationValue,
        registerUser,
        loginUser,
        loggoutUser,
        addNewAddress,
        renderUserAddress,
        renderTransactionAddressSelector,
        isExipiredLogin,
    };

    return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
