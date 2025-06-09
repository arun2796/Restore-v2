import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import type { IProduct } from "../../app/models/product";
import { Link } from "react-router";

type Prpos = {
  products: IProduct;
};

export default function ProductCard({ products }: Prpos) {
  return (
    <Card
      elevation={3}
      sx={{
        width: 280,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        sx={{ height: 240, backgroundsize: "cover" }}
        image={products.pictureUrl}
        title={products.name}
      />
      <CardContent>
        <Typography
          gutterBottom
          sx={{ textTransform: "uppercase" }}
          variant="subtitle2"
        >
          {products.name}
        </Typography>
        <Typography variant="h6" sx={{ color: "secondary.main" }}>
          ${(products.price / 100).toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button>Add to cart</Button>
        <Button component={Link} to={`/catalog/${products.id}`}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
