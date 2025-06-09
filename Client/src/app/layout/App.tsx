import { useState } from "react";

import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import NavBar from "./NavBar";
import { Outlet } from "react-router";

function App() {
  const [darkthem, setdarthem] = useState(false);
  // const darkthem = true;
  const paletteType = darkthem ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });

  const toggle = () => {
    setdarthem(!darkthem);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar toggle={toggle} darktheme={darkthem} />
      <Box
        sx={{
          minHeight: "100vh",
          background: darkthem
            ? "radial-gradient(circle,#1a3aba,#111B27)"
            : "radial-gradient(circle,#baecf9,#f0f9ff)",
          py: 6,
        }}
      >
        <Container maxWidth="xl" sx={{ marginTop: 8 }}>
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
