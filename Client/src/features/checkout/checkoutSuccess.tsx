import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router";
import type { Order } from "../../app/models/Orders";
import { Currency } from "../lib/unit";

export default function CheckoutSuccess() {
  const { state } = useLocation();
  const order = state.data as Order;

  if (!order) return <Typography>Problem Acessing The Order</Typography>;

  const addressString = () => {
    const address = order.shippingAddress;
    return `${address?.name}, ${address?.line1}, ${address?.city}, ${address?.state}, ${address?.postal_code}, ${address?.country}`;
  };
  const paymentString = () => {
    const card = order.paymentSummary;
    return `${card?.brand?.toUpperCase()} **** **** **** ${
      card?.last4
    } (Expires ${card?.exp_month}/${card?.exp_year})`;
  };

  return (
    <Container maxWidth="md">
      <>
        <Typography variant="h5" gutterBottom fontWeight={"bold"}>
          Thanks For Your Fake Order!
        </Typography>
        <Typography variant="body1" gutterBottom color="textsecondary">
          Your order<strong>#{order.id}</strong> will never be processed as this
          is a Fake Shop
        </Typography>
        <Paper
          elevation={1}
          sx={{
            display: "flex",
            p: 2,
            mb: 2,
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Box display="flex" justifyContent={"space-between"}>
            <Typography variant="body2" color="textsecondary">
              Order Date
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {order.orderDate}
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent={"space-between"}>
            <Typography variant="body2" color="textsecondary">
              Payment Method
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {paymentString()}
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent={"space-between"}>
            <Typography variant="body2" color="textsecondary">
              Shipping Address
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {addressString()}
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent={"space-between"}>
            <Typography variant="body2" color="textsecondary">
              Amount
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {Currency(order.total)}
            </Typography>
          </Box>
        </Paper>
        <Box display={"flex"} justifyContent={"flex-start"} gap={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/order/${order.id}`}
          >
            View your order
          </Button>
          <Button
            component={Link}
            to="/catalog"
            variant="outlined"
            color="primary"
          >
            Continue Shopping
          </Button>
        </Box>
      </>
    </Container>
  );
}
