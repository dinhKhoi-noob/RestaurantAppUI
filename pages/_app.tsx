import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import Layout from "../src/components/layout/Layout";
import LayoutContextProvider from "../src/contexts/LayoutContext";
import { createTheme, ThemeProvider, useMediaQuery, useTheme } from "@mui/material";
import { deepPurple, indigo } from "@mui/material/colors";
import AuthContextProvider from "../src/contexts/AuthContext";
import CategoryContextProvider from "../src/contexts/CategoryContext";
import DishContextProvider from "../src/contexts/DishContext";
import UploadFileContextProvider from "../src/contexts/UploadFileContext";
import CartContextProvider from "../src/contexts/CartContext";
import OrderContextProvider from "../src/contexts/OrderContext";

/**
 * Main page.
 * @param {ReactNode} Component is the app's component.
 * @param {ScriptProps} pageProps is the app's props.
 * @return {ReactNode} is the app's content.
 */
function MyApp({ Component, pageProps }: AppProps) {
    const themeBreakpoints = useTheme();
    const xsMatched = useMediaQuery(themeBreakpoints.breakpoints.up("xs"));
    const mdMatched = useMediaQuery(themeBreakpoints.breakpoints.up("md"));
    const smMatched = useMediaQuery(themeBreakpoints.breakpoints.up("sm"));
    const lgMatched = useMediaQuery(themeBreakpoints.breakpoints.up("lg"));
    const xlMatched = useMediaQuery(themeBreakpoints.breakpoints.up("xl"));
    const [htmlFontSize, setHtmlFontSize] = useState(14);
    useEffect(() => {
        if (xlMatched) {
            setHtmlFontSize(12);
            return;
        }
        if (lgMatched) {
            setHtmlFontSize(14);
            return;
        }
        if (mdMatched) {
            setHtmlFontSize(16);
            return;
        }
        if (smMatched) {
            setHtmlFontSize(18);
            return;
        }
        if (xsMatched) {
            setHtmlFontSize(20);
            return;
        }
    }, [xsMatched, smMatched, mdMatched, lgMatched, xlMatched]);
    const theme = createTheme({
        palette: {
            primary: indigo,
            secondary: deepPurple,
        },
        typography: {
            fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;`,
            htmlFontSize: htmlFontSize,
            button: {
                textTransform: "none",
            },
        },
    });
    return (
        <LayoutContextProvider>
            <ThemeProvider theme={theme}>
                <AuthContextProvider>
                    <CartContextProvider>
                        <Layout>
                            <UploadFileContextProvider>
                                <CategoryContextProvider>
                                    <DishContextProvider>
                                        <OrderContextProvider>
                                            <Component {...pageProps} />
                                        </OrderContextProvider>
                                    </DishContextProvider>
                                </CategoryContextProvider>
                            </UploadFileContextProvider>
                        </Layout>
                    </CartContextProvider>
                </AuthContextProvider>
            </ThemeProvider>
        </LayoutContextProvider>
    );
}

export default MyApp;
