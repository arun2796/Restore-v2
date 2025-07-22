import { Grid2, Typography } from "@mui/material";
import OrderSummary from "../../app/shared/component/ordersummary";
import CheckoutStepper from "./CheckoutStepper";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useFetchBasketQuery } from "../basket/basketApi";
import { useEffect, useMemo, useRef } from "react";
import { useCreatepaymentIntentMutation } from "./checkoutApi";
import { UseAppSelector } from "../../app/store/hook";

const StripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
export default function CheckOutPage() {
  const { data: basket } = useFetchBasketQuery();
  const [createPaymentIntent, { isLoading }] = useCreatepaymentIntentMutation();
  const created = useRef(false);
  const { darkmode } = UseAppSelector((state) => state.ui);

  useEffect(() => {
    if (basket && !created.current) createPaymentIntent();
    created.current = true;
  }, [basket, createPaymentIntent]);

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!basket?.clientSecret) return undefined;
    return {
      clientSecret: basket.clientSecret,
      appearance: {
        label: "floating",
        theme: darkmode ? "stripe" : "night",
      },
    };
  }, [basket?.clientSecret, darkmode]);
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={8}>
        {!StripePromise || !options || isLoading ? (
          <Typography variant="h5">Loading checkout...</Typography>
        ) : (
          <Elements stripe={StripePromise} options={options}>
            <CheckoutStepper />
          </Elements>
        )}
      </Grid2>
      <Grid2 size={4}>
        <OrderSummary />
      </Grid2>
    </Grid2>
  );
}
