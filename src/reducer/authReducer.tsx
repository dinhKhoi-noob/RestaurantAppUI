import { RegisterUserValues, UserAddressValue, UserInformationValues } from "../contexts/AuthContext";

export type authReducerAction = "userAddress" | "userInfo" | "changeRegisterationValue" | "loadAddress";

export interface AuthReducerAction {
    type: authReducerAction;
    payload: any | UserInformationValues | RegisterUserValues | UserAddressValue[];
}

export interface AuthReducerState {
    addressList: UserAddressValue[];
    userInfo: UserInformationValues;
    registerationValues: RegisterUserValues;
}

export const authReducer = (state: AuthReducerState, actions: AuthReducerAction) => {
    const { type, payload } = actions;
    switch (type) {
        case "userInfo":
            return {
                ...state,
                userInfo: payload as UserInformationValues,
            };
        case "changeRegisterationValue":
            return {
                ...state,
                registerationValues: payload as RegisterUserValues,
            };
        case "loadAddress":
            return {
                ...state,
                addressList: payload as UserAddressValue[],
            };
        default:
            return state;
    }
};

export default authReducer;
