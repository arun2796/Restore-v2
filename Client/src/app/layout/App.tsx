import { useEffect, useState } from "react";
import type { IProduct } from "../models/product";
import Catalog from "../../features/catalog/Catalog";
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import NavBar from "./NavBar";

function App() {
  const [products, setproduct] = useState<IProduct[]>([]);
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

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const context = await fetch("https://localhost:5166/api/Product"); // use HTTPS here too
        const data = await context.json();
        setproduct(data);
      } catch (error) {
        console.log(error, " fetch error");
      }
    };
    fetchdata();
  }, []);

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
          <Catalog products={products} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
