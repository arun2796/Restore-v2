import { Box } from "@mui/material";
import type { IProduct } from "../../app/models/product";
import ProductCard from "./ProductCard";

type Props = {
  products: IProduct[];
};

export default function ProductList({ products }: Props) {
  return (
       <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3 }}>
      {products.map((product) => (
        <ProductCard key={product.id} products={product} />
      ))}
    </Box>
  );
}
