import { Grid2 } from "@mui/material";
import type { IProduct } from "../../app/models/product";
import ProductCard from "./ProductCard";

type Props = {
  products: IProduct[];
};

export default function ProductList({ products }: Props) {
  return (
    <Grid2 container spacing={3}>
      {products.map((product) => (
        <Grid2 size={4} display="flex" key={product.id}>
          <ProductCard products={product} />
        </Grid2>
      ))}
    </Grid2>
  );
}
