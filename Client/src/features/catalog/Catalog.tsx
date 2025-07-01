import ProductList from "./ProductList";
import { useFetchFilterQuery, useFetchproductQuery } from "./catalogApi";
import Grid2 from "@mui/material/Grid2";
import Filters from "./Filters";

import AddPagination from "../../app/shared/component/AddPagination";
import { setPageNumber } from "./catalogslice";
import { Typography } from "@mui/material";
import { UseAppDispatch, UseAppSelector } from "../../app/store/hook";

function Catalog() {
  const productparams = UseAppSelector((state) => state.catalog);
  const { data, isLoading } = useFetchproductQuery(productparams);
  const { data: filterdata, isLoading: Filterloading } = useFetchFilterQuery();
  const dispatch = UseAppDispatch();

  if (isLoading || !data || Filterloading || !filterdata)
    return <div>Loading.....</div>;

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={3}>
        <Filters filterdata={filterdata} />
      </Grid2>
      <Grid2 size={9}>
        {data.item && data.item.length > 0 ? (
          <>
            <ProductList products={data.item} />
            <AddPagination
              metadata={data.pagination}
              onChangePage={(page: number) => {
                dispatch(setPageNumber(page));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        ) : (
          <Typography variant="h5">
            There is no result found in this filter
          </Typography>
        )}
      </Grid2>
    </Grid2>
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
