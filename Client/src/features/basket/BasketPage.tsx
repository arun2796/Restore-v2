import { Grid2, Typography } from "@mui/material";
import { useFetchBasketQuery } from "./basketApi";
import BasketItems from "./BasketItems";
import OrderSummary from "../../app/shared/component/ordersummary";

export default function BasketPage() {
  const { data, isLoading } = useFetchBasketQuery();

  if (isLoading) return <Typography>loading Basket....</Typography>;
  if (!data || data.items.length === 0)
    return <Typography>basket is empty</Typography>;
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={8}>
        {data.items.map((item) => (
          <BasketItems key={item.productId} item={item} />
        ))}
      </Grid2>
      <Grid2 size={4}>
        <OrderSummary />
      </Grid2>
    </Grid2>
  );
}
