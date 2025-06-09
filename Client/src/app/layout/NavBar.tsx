import { Badge, Box } from "@mui/material";
import { ShoppingBagIcon } from "lucide-react";
import {
  AppBar,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";

import { NavLink } from "react-router";
import { DarkMode, LightMode } from "@mui/icons-material";

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

type Prpos = {
  toggle: () => void;
  darktheme: boolean;
};

export default function NavBar({ toggle, darktheme }: Prpos) {
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
          <IconButton onClick={toggle}>
            {darktheme ? (
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
        <Box display="flex" alignItems="center" >
          <IconButton size="large" color="inherit">
            <Badge badgeContent="4" color="primary">
              <ShoppingBagIcon />
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
    </AppBar>
  );
}
