import { Fragment } from "react/jsx-runtime";
import type { IProduct } from "../../app/models/product";
import ProductList from "./ProductList";

type props = {
  products: IProduct[]; // ✅ named "products"
  // addProduct: () => void;
};

function Catalog({ products}: props) {
  return (
    <Fragment>
      <ProductList products={products} />
    </Fragment>
  );
}

export default Catalog;
