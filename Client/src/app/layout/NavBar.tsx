import { Badge, Box, LinearProgress } from "@mui/material";

import {
  AppBar,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";

import { Link, NavLink } from "react-router-dom";
import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import { UseAppDispatch, UseAppSelector } from "../store/store";
import { SetdarkMode } from "./uiSlice";
import { useFetchBasketQuery } from "../../features/basket/basketApi";

const navstyle = {
  color: "inherit",
  typography: "h6",
  textDecoration: "none",
  "&:hover": { color: "grey.500" },
  "&.active": { color: "#baecf6" },
};

const midlelink = [
  { Title: "catalog", path: "/catalog" },
  { Title: "about", path: "/about" },
  { Title: "contact", path: "/contact" },
];

const rightlink = [
  {
    Title: "login",
    path: "/login",
  },
  { Title: "registrer", path: "/register" },
];

export default function NavBar() {
  const { isloading, darkmode } = UseAppSelector((state) => state.ui);
  const dispatch = UseAppDispatch();

  const { data: basket } = useFetchBasketQuery();

  const itemcount =
    basket?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography component={NavLink} sx={navstyle} to={"/"} variant="h6">
            RE-STORE
          </Typography>
          <IconButton onClick={() => dispatch(SetdarkMode())}>
            {darkmode ? (
              <DarkMode />
            ) : (
              <LightMode sx={{ color: "yellowgreen" }} />
            )}
          </IconButton>
        </Box>

        <List sx={{ display: "flex" }}>
          {midlelink.map(({ Title, path }) => (
            <ListItem component={NavLink} to={path} key={path} sx={navstyle}>
              {Title.toUpperCase()}
            </ListItem>
          ))}
        </List>
        <Box display="flex" alignItems="center">
          <IconButton
            component={Link}
            to="/basket"
            size="large"
            color="inherit"
          >
            <Badge badgeContent={itemcount} color="primary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          <List sx={{ display: "flex", justifyContent: "end" }}>
            {rightlink.map(({ Title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={navstyle}>
                {Title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>
      </Toolbar>
      {isloading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress color="secondary" />
        </Box>
      )}
    </AppBar>
  );
}
