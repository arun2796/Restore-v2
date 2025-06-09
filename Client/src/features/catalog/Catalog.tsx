import { Fragment } from "react/jsx-runtime";

import ProductList from "./ProductList";
import { useEffect, useState } from "react";
import type { IProduct } from "../../app/models/product";

function Catalog() {
  const [products, setproduct] = useState<IProduct[]>([]);
  
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const context = await fetch("https://localhost:5166/api/Product"); // use HTTPS here too
        const data = await context.json();
        setproduct(data);
      } catch (error) {
        console.log(error, " fetch error");
      }
    };
    fetchdata();
  }, []);
  return (
    <Fragment>
      <ProductList products={products} />
    </Fragment>
  );
}

export default Catalog;
