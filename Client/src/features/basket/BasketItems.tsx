import { Box, Grid2, IconButton, Paper, Typography } from "@mui/material";
import type { Item } from "../../app/models/Basket";
import { Add, Close, Remove } from "@mui/icons-material";
import {
  useAddBasketItemMutation,
  useRemoveBasketItemMutation,
} from "./basketApi";
import { Currency } from "../lib/unit";

type Props = {
  item: Item;
};

export default function BasketItems({ item }: Props) {
  const [removeitem] = useRemoveBasketItemMutation();

  const [addItem] = useAddBasketItemMutation();

  return (
    <Paper
      sx={{
        height: 150,
        borderRadius: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Box display={"flex"} alignItems={"center"}>
        <Box
          component={"img"}
          src={item.pictureUrl}
          alt={item.name}
          sx={{
            height: 100,
            width: 100,
            objectFit: "cover",
            borderRadius: "4px",
            mr: 8,
            ml: 2,
          }}
        ></Box>
        <Box display={"flex"} flexDirection={"column"} gap={1}>
          <Typography variant="h6">{item.name}</Typography>
          <Box display={"flex"} alignItems="center" gap={3}>
            <Typography sx={{ fontSize: "1.1rem" }}>
              {Currency(item.price)} x {item.quantity}
            </Typography>
            <Typography sx={{ fontSize: "1.1rem" }} color="primary">
              {Currency(item.price * item.quantity)}
            </Typography>
          </Box>
          <Grid2 container spacing={1} alignItems={"center"}>
            <IconButton
              onClick={() =>
                removeitem({ productId: item.productId, quantity: 1 })
              }
              color="error"
              size="small"
              sx={{ border: 1, borderRadius: 1, minWidth: 0 }}
            >
              <Remove />
            </IconButton>
            {item.quantity}
            <IconButton
              onClick={() => addItem({ product: item, quantity: 1 })}
              color="success"
              size="small"
              sx={{ border: 1, borderRadius: 1, minWidth: 0 }}
            >
              <Add />
            </IconButton>
          </Grid2>
        </Box>
      </Box>
      <IconButton
        onClick={() =>
          removeitem({ productId: item.productId, quantity: item.quantity })
        }
        color="error"
        sx={{
          border: 1,
          borderRadius: 1,
          minWidth: 0,
          alignSelf: "start",
          mr: 1,
          mt: 1,
        }}
      >
        <Close />
      </IconButton>
    </Paper>
  );
}
