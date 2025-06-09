import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { IProduct } from "../../app/models/product";
import {
  Button,
  Divider,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setproduct] = useState<IProduct | null>(null);
  const productDetais = [
    { label: "Name", value: product?.name },
    { label: "Descirption", value: product?.descirption },
    { label: "Type", value: product?.type },
    { label: "Brand", value: product?.brand },
    { label: "QuantityInStock ", value: product?.quantityInStock },
  ];

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const context = await fetch(`https://localhost:5166/api/Product/${id}`);
        const data = await context.json();
        setproduct(data);
      } catch (error) {
        console.log(error, " fetch error");
      }
    };
    fetchdata();
  }, [id]);

  if (!product) return <div>Loading....</div>;
  return (
    <Grid2 container spacing={6} maxWidth="lg" sx={{ mx: "auto" }}>
      <Grid2 size={6}>
        <img
          src={product?.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid2>
      <Grid2 size={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table
            sx={{
              "&,td": { fontSize: "1.2rem" },
            }}
          >
            <TableBody>
              {productDetais.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell style={{ fontWeight: "bold" }}>
                    {detail.label}
                  </TableCell>
                  <TableCell>{detail.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid2 container spacing={2} mt={3}>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in basket"
              fullWidth
              defaultValue={1}
            />
          </Grid2>
          <Grid2 size={6}>
            <Button
              sx={{ height: "55px" }}
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Add to Basket
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
