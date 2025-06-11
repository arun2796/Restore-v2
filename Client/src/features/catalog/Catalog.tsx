import { Fragment } from "react/jsx-runtime";
import ProductList from "./ProductList";
import { useFetchproductQuery } from "./catalogApi";

function Catalog() {
  const { data, isLoading } = useFetchproductQuery();

  if (isLoading || !data) return <div>Loading.....</div>;

  return (
    <Fragment>
      <ProductList products={data} />
    </Fragment>
  );
}

export default Catalog;

// const [products, setproduct] = useState<IProduct[]>([]);

//   useEffect(() => {
//     const fetchdata = async () => {
//       try {
//         const context = await fetch("https://localhost:5166/api/Product");
//         const data = await context.json();
//         setproduct(data);
//       } catch (error) {
//         console.log(error, " fetch error");
//       }
//     };
//     fetchdata();
//   }, []);
