import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import type { User } from "../models/User";
import { History, Inventory2, Logout, Person } from "@mui/icons-material";
import { useLogoutMutation } from "../../features/account/accountApi";
import { Link } from "react-router";

type prpos = {
  user: User;
};

export default function Usermenu({ user }: prpos) {
  const [logout] = useLogoutMutation();
  // State to manage the anchor element for the menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        color="inherit"
        size="large"
        sx={{ fontSize: "1.1rem" }}
      >
        {user.email}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to={"/order"}>
          <ListItemIcon>
            <History />
          </ListItemIcon>
          <ListItemText>My Order</ListItemText>
        </MenuItem>
        {user.roles.includes("Member") && (
          <MenuItem component={Link} to={"/inventory"}>
            <ListItemIcon>
              <Inventory2 />
            </ListItemIcon>
            <ListItemText>Inventory</ListItemText>
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={() => logout()}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>LogOut</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
