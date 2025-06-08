import { DarkMode, LightMode } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

type Prpos = {
  toggle: () => void;
  darktheme: boolean;
};

export default function NavBar({ toggle, darktheme }: Prpos) {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">RE-STORE</Typography>
        <IconButton onClick={toggle}>
          {darktheme ? (
            <DarkMode />
          ) : (
            <LightMode sx={{ color: "yellowgreen" }} />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

// {/* <Box
//           sx={{ display: "flex", justifyContent: "center", gap: 3, marginY: 3 }}
//         >
//           <Typography variant="h4">Restore</Typography>
//           {/* <Button variant="contained" onClick={addProduct}>
//             AddPoduct
//           </Button> */}
//         </Box> }
