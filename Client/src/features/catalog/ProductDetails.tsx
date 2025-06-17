import { useParams } from "react-router";

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
import { useFetchproductDetailsQuery } from "./catalogApi";
import {
  useAddBasketItemMutation,
  useFetchBasketQuery,
  useRemoveBasketItemMutation,
} from "../basket/basketApi";
import { useEffect, useState, type ChangeEvent } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  const [removebasketItem] = useRemoveBasketItemMutation();
  const [addBasketItem] = useAddBasketItemMutation();
  const { data: basket } = useFetchBasketQuery();
  const item = basket?.items.find((x) => x.productId === +id!);
  const [quantity, setQuantity] = useState(0);

  const { data: product, isLoading } = useFetchproductDetailsQuery(
    id ? parseInt(id) : 0
  );
  useEffect(() => {
    if (item) setQuantity(item.quantity);
  }, [item]);

  const productDetais = [
    { label: "Name", value: product?.name },
    { label: "Descirption", value: product?.descirption },
    { label: "Type", value: product?.type },
    { label: "Brand", value: product?.brand },
    { label: "QuantityInStock ", value: product?.quantityInStock },
  ];

  if (!product || isLoading) return <div>Loading....</div>;

  const handelUpdateBasket = () => {
    const updateItem = item ? Math.abs(quantity - item.quantity) : quantity;
    if (!item || quantity > item.quantity) {
      addBasketItem({ product, quantity: updateItem });
    } else {
      removebasketItem({ productId: product.id, quantity: updateItem });
    }
  };

  const handelInputbasket = (event: ChangeEvent<HTMLInputElement>) => {
    const value = +event.currentTarget.value;
    if (value >= 0) setQuantity(value);
  };
  return (
    <Grid2 container spacing={6} maxWidth="lg" sx={{ mx: "auto" }}>
      <Grid2 size={6}>
        <img
          src={product?.pictureUrl}
          alt={product.name}
          style={{ width: "100%", borderRadius: 8 }}
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
              value={quantity}
              onChange={handelInputbasket}
            />
          </Grid2>
          <Grid2 size={6}>
            <Button
              onClick={handelUpdateBasket}
              disabled={
                quantity === item?.quantity || (!item && quantity === 0)
              }
              sx={{ height: "55px" }}
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              {item ? "update quantity" : "Add to Basket"}
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
