/* eslint-disable react/no-children-prop */
import {
    Box,
    Collapse,
    IconButton,
    IconButtonProps,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LayoutContext, NavigationBarValue } from "../../contexts/LayoutContext";

export interface NavigationBarProps {
    item: NavigationBarValue;
    subItems: NavigationBarValue[];
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    // eslint-disable-next-line no-unused-vars
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

const NavigationBarItem = (props: NavigationBarProps) => {
    const { item, subItems } = props;
    const { icon, title, url } = item;
    const router = useRouter();
    const { isOpenLeftNavbar, handleToggleOnNavbar } = useContext(LayoutContext);
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const navigate = (url: string) => {
        router.push(url);
        handleToggleOnNavbar(false);
        handleExpandClick();
    };

    return subItems.length > 0 ? (
        <>
            <ListItemButton
                key={title}
                sx={{
                    minHeight: 48,
                    justifyContent: isOpenLeftNavbar ? "initial" : "center",
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: isOpenLeftNavbar ? 3 : "auto",
                        justifyContent: "center",
                    }}
                >
                    {icon}
                </ListItemIcon>
                <ListItemText
                    children={
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            onClick={handleExpandClick}
                        >
                            <Typography>{title}</Typography>
                            <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
                                <MdKeyboardArrowDown />
                            </ExpandMore>
                        </Box>
                    }
                    sx={{ opacity: isOpenLeftNavbar ? 1 : 0 }}
                />
            </ListItemButton>
            <Box ml={3}>
                <Collapse in={expanded && isOpenLeftNavbar} timeout="auto" unmountOnExit>
                    {subItems.map((item: NavigationBarValue, index: number) => {
                        return (
                            <ListItemButton
                                key={index}
                                onClick={() => {
                                    navigate(item.url);
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        );
                    })}
                </Collapse>
            </Box>
        </>
    ) : (
        <ListItemButton
            key={title}
            sx={{
                minHeight: 48,
                justifyContent: isOpenLeftNavbar ? "initial" : "center",
                px: 2.5,
            }}
            onClick={() => {
                navigate(url);
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: 0,
                    mr: isOpenLeftNavbar ? 3 : "auto",
                    justifyContent: "center",
                }}
            >
                {icon}
            </ListItemIcon>
            <ListItemText primary={title} sx={{ opacity: isOpenLeftNavbar ? 1 : 0 }} />
        </ListItemButton>
    );
};

export default NavigationBarItem;
