import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

import { Currency } from "../lib/unit";
import type { ConfirmationToken } from "@stripe/stripe-js";
import { useBasket } from "../lib/hooks/useBasket";

type Props = {
  confirmationToken: ConfirmationToken | null;
};

export default function Review({ confirmationToken }: Props) {
  const { basket } = useBasket();
  const addressString = () => {
    if (!confirmationToken?.shipping) return "No shipping address provided";
    const { address, name } = confirmationToken.shipping;
    return `${name}, ${address?.line1}, ${address?.city}, ${address?.state}, ${address?.postal_code}, ${address?.country}`;
  };
  const paymentString = () => {
    if (!confirmationToken?.payment_method_preview.card)
      return "No payment method provided";
    const { brand, last4, exp_month, exp_year } =
      confirmationToken.payment_method_preview.card;
    return `${brand.toUpperCase()} **** **** **** ${last4} (Expires ${exp_month}/${exp_year})`;
  };
  return (
    <>
      <Box mt={4} width={"100"}>
        <Typography variant="h5" fontWeight={"bold"}>
          Billing and delivery information
        </Typography>
        <dl>
          <Typography component={"dt"} fontWeight={"medium"}>
            Shipping Address
          </Typography>
          <Typography component={"dd"} mt={1} color="textsecondary">
            {addressString()}
          </Typography>
          <Typography component={"dt"} fontWeight={"medium"}>
            Payment Details
          </Typography>
          <Typography component={"dd"} mt={1} color="textsecondary">
            {paymentString()}
          </Typography>
        </dl>
      </Box>
      <Box mt={6} mx={"auto"}>
        <Divider />
        <TableContainer>
          <Table>
            <TableBody>
              {basket?.items.map((item) => (
                <TableRow
                  key={item.productId}
                  sx={{ borderBottom: "1px solid rgba(224,224,224,1)" }}
                >
                  <TableCell sx={{ py: 4 }}>
                    <Box display="flex" gap={2} alignItems="center">
                      <img
                        src={item.pictureUrl}
                        alt={item.name}
                        style={{ width: 40, height: 40 }}
                      />
                      <Typography>{item.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ p: 4 }}>
                    x{item.quantity}
                  </TableCell>
                  <TableCell align="center" sx={{ p: 4 }}>
                    {Currency(item.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
