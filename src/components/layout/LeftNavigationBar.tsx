/* eslint-disable react/no-children-prop */
import React, { useContext, useEffect } from "react";
import {
    Box,
    CSSObject,
    Divider,
    List,
    styled,
    Theme,
    AppBarProps as MuiAppBarProps,
    CssBaseline,
    Toolbar,
    IconButton,
    Typography,
    useTheme,
    Tooltip,
    Avatar,
    Menu,
    MenuItem,
    Badge,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdOutlineFastfood } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { BiBookHeart, BiDrink } from "react-icons/bi";
import { BsCart } from "react-icons/bs";
import { GiHamburger } from "react-icons/gi";
import { IoFastFoodOutline, IoSettingsOutline } from "react-icons/io5";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { RiShieldUserLine } from "react-icons/ri";
import { CgMenuBoxed } from "react-icons/cg";
import { LayoutContext } from "../../contexts/LayoutContext";
import NavigationBarItem, { NavigationBarProps } from "./NavigationBarItem";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: prop => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== "open" })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

const LeftNavigationBar = () => {
    const {
        isOpenLeftNavbar,
        hasNewOrder,
        changeHasNewOrderStatus,
        handleToggleOnNavbar,
        changeConfirmationModalValues,
        changeOpenCartStatus,
        changeOpenFavoriteListStatus,
    } = useContext(LayoutContext);
    const { userInfo, loadUserInfo } = useContext(AuthContext);
    const { cartItems, favoriteList, loadCarts, loadFavoriteList } = useContext(CartContext);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    useEffect(() => {
        loadUserInfo();
    }, []);
    useEffect(() => {
        console.log(userInfo);
    }, [userInfo]);
    const theme = useTheme();

    const leftNavigationBarValues: NavigationBarProps[] = [
        {
            item: {
                icon: <AiOutlineHome />,
                title: "Home",
                url: "/",
                role: [],
            },
            subItems: [],
        },
        {
            item: {
                icon: <IoFastFoodOutline />,
                title: "All Dishes",
                url: "/dishes",
                role: [],
            },
            subItems: [
                {
                    icon: <GiHamburger />,
                    title: "Food",
                    url: "/dishes/food",
                    role: [],
                },
                {
                    icon: <BiDrink />,
                    title: "Drink",
                    url: "/dishes/drink",
                    role: [],
                },
            ],
        },
        {
            item: {
                icon: <IoSettingsOutline />,
                title: "Manage",
                url: "/",
                role: ["manager"],
            },
            subItems: [
                {
                    icon: <CgMenuBoxed />,
                    title: "Category",
                    url: "/manage/category",
                    role: ["manager"],
                },
                {
                    icon: <MdOutlineFastfood />,
                    title: "Dish",
                    url: "/manage/dish",
                    role: ["manager"],
                },
            ],
        },
        {
            item: {
                icon: <FaFileInvoiceDollar />,
                title: "Order",
                url: "/order",
                role: ["manager", "shipper"],
            },
            subItems: [],
        },
        {
            item: {
                icon: hasNewOrder ? (
                    <Badge
                        variant="dot"
                        color="error"
                        onClick={() => {
                            changeHasNewOrderStatus(false);
                        }}
                    >
                        <FaFileInvoiceDollar />
                    </Badge>
                ) : (
                    <FaFileInvoiceDollar />
                ),
                title: "My Order",
                url: "/my_order",
                role: ["customer"],
            },
            subItems: [],
        },
        {
            item: {
                icon: <RiShieldUserLine />,
                title: "Profile",
                url: "/profile",
                role: [],
            },
            subItems: [],
        },
    ];

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleToggleOnLoggoutButton = () => {
        handleCloseUserMenu();
        changeConfirmationModalValues({
            isToggle: true,
            type: "loggout",
            title: "Do you really want to logout?",
        });
    };

    const handleOpenCart = () => {
        loadCarts();
        changeOpenCartStatus();
    };

    const handleOpenFavorite = () => {
        loadFavoriteList();
        changeOpenFavoriteListStatus();
    };

    return (
        <Box display="flex" role="presentation">
            <CssBaseline />
            <AppBar position="fixed" open={isOpenLeftNavbar}>
                <Toolbar>
                    <Box display="flex" justifyContent="space-between" style={{ width: "100%" }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={() => handleToggleOnNavbar()}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(isOpenLeftNavbar && { display: "none" }),
                            }}
                        >
                            <FiMenu />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Mini variant drawer
                        </Typography>
                        <Box
                            sx={{ flexGrow: 0, width: "100px" }}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Tooltip title="Your favorites">
                                <Badge
                                    badgeContent={favoriteList.length > 0 ? favoriteList.length : 0}
                                    color="error"
                                    onClick={handleOpenFavorite}
                                >
                                    <BiBookHeart style={{ color: "white" }} />
                                </Badge>
                            </Tooltip>
                            <Tooltip title="Your cart">
                                <Badge
                                    badgeContent={
                                        cartItems.length > 0
                                            ? cartItems
                                                  .map(cartItem => cartItem.quantity)
                                                  .reduce((previous, next) => previous + next)
                                            : 0
                                    }
                                    color="error"
                                    onClick={handleOpenCart}
                                >
                                    <BsCart style={{ color: "white" }} />
                                </Badge>
                            </Tooltip>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Someone" src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem>
                                    <Typography textAlign="center">Profile</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleToggleOnLoggoutButton}>
                                    <Typography textAlign="center">Loggout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={isOpenLeftNavbar}>
                <DrawerHeader>
                    <IconButton onClick={() => handleToggleOnNavbar()}>
                        {theme.direction === "rtl" ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {leftNavigationBarValues.map((element: NavigationBarProps, index: number) => {
                        const { item, subItems } = element;
                        const { role } = item;
                        const roleIndex = role.findIndex((role: string) => {
                            return role === userInfo.role;
                        });
                        return roleIndex > -1 || role.length === 0 ? (
                            <NavigationBarItem key={index} item={item} subItems={subItems} />
                        ) : (
                            <></>
                        );
                    })}
                </List>
            </Drawer>
        </Box>
    );
};

export default LeftNavigationBar;
