import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { UseAppDispatch, UseAppSelector } from "../../app/store/hook";
import { useFetchproductQuery } from "../catalog/catalogApi";
import { Currency } from "../lib/unit";
import { Delete, Edit } from "@mui/icons-material";
import AddPagination from "../../app/shared/component/AddPagination";
import { setPageNumber } from "../catalog/catalogslice";
import { useState } from "react";
import ProductForms from "./ProductForms";
import type { IProduct } from "../../app/models/product";
import { useDeleteProductMutation } from "./adminApi";

export default function Inventory() {
  const productParams = UseAppSelector((state) => state.catalog);
  const { data, refetch } = useFetchproductQuery(productParams);
  const dispatch = UseAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [DeleteProduct] = useDeleteProductMutation();
  const [SelectedProduct, SetSelectedproduct] = useState<IProduct | null>(null);

  const handleSelectProduct = (product: IProduct) => {
    SetSelectedproduct(product);
    setEditMode(true);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await DeleteProduct(id);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  if (editMode)
    return (
      <ProductForms
        setEditMode={setEditMode}
        product={SelectedProduct}
        refetch={refetch}
        SetSelectedproduct={SetSelectedproduct}
      />
    );

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          Inventory
        </Typography>
        <Button
          onClick={() => setEditMode(true)}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Create
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Brand</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.item.map((value) => (
                <TableRow
                  key={value.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {value.id}
                  </TableCell>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <img
                        src={value.pictureUrl}
                        alt={value.name}
                        style={{ height: 50, marginRight: 20 }}
                      />
                      <span>{value.name}</span>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{Currency(value.price)}</TableCell>
                  <TableCell align="center">{value.type}</TableCell>
                  <TableCell align="center">{value.brand}</TableCell>
                  <TableCell align="center">{value.quantityInStock}</TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => handleSelectProduct(value)}
                      startIcon={<Edit />}
                    />
                    <Button
                      onClick={() => handleDeleteProduct(value.id)}
                      startIcon={<Delete />}
                      color="error"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Box sx={{ p: 3 }}>
          {data?.pagination && data.item.length > 0 && (
            <AddPagination
              metadata={data.pagination}
              onChangePage={(page: number) => dispatch(setPageNumber(page))}
            />
          )}
        </Box>
      </TableContainer>
    </>
  );
}
