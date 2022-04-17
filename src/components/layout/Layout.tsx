import React, { ReactNode, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import { LayoutContext } from "../../contexts/LayoutContext";
import Cart from "./Cart";
import ConfirmationModal from "./ConfirmationModal";
import FavoriteList from "./FavoriteList";
import LeftNavigationBar from "./LeftNavigationBar";
import Snackbar from "./Snackbar";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { isHideLayout, snackbarValues } = useContext(LayoutContext);
    const { loadCarts } = useContext(CartContext);
    const { isExipiredLogin } = useContext(AuthContext);
    useEffect(() => {
        loadCarts();
        isExipiredLogin();
    }, []);
    const { content, type, isToggle } = snackbarValues;
    return !isHideLayout ? (
        <div>
            <ConfirmationModal />
            <LeftNavigationBar />
            <FavoriteList />
            <Cart />
            <Snackbar content={content} type={type} isToggle={isToggle} />
            <div className="wrapper">{children}</div>
        </div>
    ) : (
        <div>
            <Snackbar content={content} type={type} isToggle={isToggle} />
            {children}
        </div>
    );
};

export default Layout;
