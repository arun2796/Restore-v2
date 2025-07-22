import {
  Box,
  Button,
  FormControlLabel,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Checkbox,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import Review from "./Review";
import {
  useFetchAddressQuery,
  useUpdateUserAddressMutation,
} from "../account/accountApi";
import type { Address } from "../../app/models/User";
import type {
  ConfirmationToken,
  StripeAddressElementChangeEvent,
  StripePaymentElementChangeEvent,
} from "@stripe/stripe-js";
import { useBasket } from "../lib/hooks/useBasket";
import { Currency } from "../lib/unit";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useCreateOrderMutation } from "../order/orderApi";

const step = ["Address", "Payment", "Review"];
export default function CheckoutStepper() {
  const { data: { name, ...restaddress } = {} as Address, isLoading } =
    useFetchAddressQuery();
  const [actionstep, setActionstep] = useState(0);
  const [UpdateAddress] = useUpdateUserAddressMutation();
  const [CreateOrder] = useCreateOrderMutation();
  const [SaveAddress, setSaveAddress] = useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const [CompleteAddress, setCompleteAddress] = useState(false);
  const [PaymentComplete, setPaymentComplete] = useState(false);
  const { total, clearBasket } = useBasket();
  const { basket } = useBasket();
  const navigation = useNavigate();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmationtoken, setConfirmationToken] =
    useState<ConfirmationToken | null>(null);

  const handleNext = async () => {
    if (actionstep === 0 && SaveAddress && elements) {
      const address = await getStripeAddress();
      if (address) await UpdateAddress(address);
      else return toast.error("Please enter a valid address");
    }
    if (actionstep === 1) {
      if (!stripe || !elements) return;
      const result = await elements.submit();
      if (result.error) return toast.error(result.error.message);
      const StripeResult = await stripe.createConfirmationToken({ elements });
      if (StripeResult.error) {
        return toast.error(StripeResult.error.message);
      }
      setConfirmationToken(StripeResult.confirmationToken);
      if (!StripeResult.confirmationToken)
        return toast.error("No confirmation token received");
      if (SaveAddress && elements) {
        const address = await getStripeAddress();
        if (address) await UpdateAddress(address);
        else return toast.error("Please enter a valid address");
      }
    }
    if (actionstep === 2) {
      await confirmPayment();
    }
    if (actionstep < 2) setActionstep((step) => step + 1);
  };
  const confirmPayment = async () => {
    setSubmitting(true);
    try {
      if (!confirmationtoken || !basket?.clientSecret)
        throw new Error("No confirmation token or client secret found");
      const orderMode = await createOrderModule();
      const orderResult = await CreateOrder(orderMode);
      const paymentResult = await stripe?.confirmPayment({
        clientSecret: basket.clientSecret,
        redirect: "if_required",
        confirmParams: { confirmation_token: confirmationtoken.id },
      });
      if (paymentResult?.paymentIntent?.status === "succeeded") {
        toast.success("Payment successful!");
        navigation("/checkout/success", { state: orderResult });
        clearBasket();
      } else if (paymentResult?.error) {
        throw new Error(paymentResult.error.message);
      } else {
        toast.error("Payment failed, please try again.");
        setActionstep(0);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      setActionstep((step) => step - 1);
    } finally {
      setSubmitting(false);
    }
  };

  const createOrderModule = async () => {
    const ShippingAddress = await getStripeAddress();
    const PaymentSummary = confirmationtoken?.payment_method_preview.card;

    if (!ShippingAddress || !PaymentSummary)
      throw new Error("Problem in creating Order");
    return { ShippingAddress, PaymentSummary };
  };

  const getStripeAddress = async () => {
    const addressElement = elements?.getElement("address");
    if (!addressElement) return null;
    const {
      value: { name, address },
    } = await addressElement.getValue();
    if (name && address) return { ...address, name };
    return null;
  };
  const handleBack = () => {
    setActionstep((step) => step - 1);
  };

  const handleAdressChange = (event: StripeAddressElementChangeEvent) => {
    setCompleteAddress(event.complete);
  };
  const handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    setPaymentComplete(event.complete);
  };
  if (isLoading)
    return <Typography variant="h5">Loading checkout...</Typography>;
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stepper activeStep={actionstep}>
        {step.map((value, index) => {
          return (
            <Step key={index}>
              <StepLabel>{value}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: actionstep === 0 ? "block" : "none" }}>
          <AddressElement
            options={{
              mode: "shipping",
              defaultValues: {
                name: name,
                address: restaddress,
              },
            }}
            onChange={handleAdressChange}
          />
          <FormControlLabel
            sx={{ display: "flex", justifyContent: "end" }}
            control={
              <Checkbox
                checked={SaveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
              />
            }
            label="save as default address"
          />
          <Typography variant="subtitle2" color="textSecondary">
            Please enter your shipping address.
          </Typography>
        </Box>
        <Box sx={{ display: actionstep === 1 ? "block" : "none" }}>
          <PaymentElement
            onChange={handlePaymentChange}
            options={{
              wallets: {
                applePay: "never",
                googlePay: "never",
              },
            }}
          />
        </Box>
        <Box sx={{ display: actionstep === 2 ? "block" : "none" }}>
          <Review confirmationToken={confirmationtoken} />
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Button onClick={handleBack}>Back</Button>
        <LoadingButton
          onClick={handleNext}
          disabled={
            (actionstep === 0 && !CompleteAddress) ||
            (actionstep === 1 && !PaymentComplete) ||
            submitting
          }
          loading={submitting}
        >
          {actionstep === step.length - 1
            ? `Place Order - ${Currency(total)}`
            : "Next"}
        </LoadingButton>
      </Box>
    </Paper>
  );
}
