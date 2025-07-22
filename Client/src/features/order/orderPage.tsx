import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useFetchOrderQuery } from "./orderApi";
import { useNavigate } from "react-router";
import { Currency } from "../lib/unit";
import { format } from "date-fns";

export default function OrderPage() {
  const { data: order, isLoading } = useFetchOrderQuery();
  const navigate = useNavigate();

  if (isLoading)
    return <Typography variant="h5"> Loading orders....</Typography>;
  if (!order) return <Typography variant="h5">No order available</Typography>;
  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center" gutterBottom>
        My order
      </Typography>
      <Paper sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">order</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.map((item) => (
              <TableRow
                key={item.id}
                hover
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/order/${item.id}`)}
              >
                <TableCell align="center">#{item.id}</TableCell>
                <TableCell>{format(item.orderDate, "dd MMM yyyy")}</TableCell>
                <TableCell>{Currency(item.total)}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
