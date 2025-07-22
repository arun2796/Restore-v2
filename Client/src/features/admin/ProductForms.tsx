import { useForm, type FieldValues } from "react-hook-form";
import {
  createProductSchema,
  type CreateProductSchema,
} from "../lib/schemas/createProductSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Grid2, Paper, Typography } from "@mui/material";
import AppTextInput from "../../app/shared/component/AppTextInput";
import { useFetchFilterQuery } from "../catalog/catalogApi";
import AppSelectInput from "../../app/shared/component/AppSelectInput";
import AppDropzone from "../../app/shared/component/AppDropzone";
import type { IProduct } from "../../app/models/product";
import { useEffect } from "react";
import { useCreateproductMutation, useUpdateproductMutation } from "./adminApi";
import { LoadingButton } from "@mui/lab";
import { handelApiError } from "../lib/unit";

type Props = {
  setEditMode: (value: boolean) => void;
  product: IProduct | null;
  refetch: () => void;
  SetSelectedproduct: (value: IProduct | null) => void;
};

export default function ProductForms({
  setEditMode,
  product,
  refetch,
  SetSelectedproduct,
}: Props) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<CreateProductSchema>({
    mode: "onTouched",
    resolver: zodResolver(createProductSchema),
  });
  const watchFile = watch("file");
  const [Createproduct] = useCreateproductMutation();
  const [UpdateProduct] = useUpdateproductMutation();

  const previewUrl = watchFile ? URL.createObjectURL(watchFile) : undefined;

  const { data } = useFetchFilterQuery();

  useEffect(() => {
    if (product) reset(product);
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [product, reset, previewUrl]);

  const createFormData = (items: FieldValues) => {
    const formdata = new FormData();
    for (const key in items) {
      formdata.append(key, items[key]);
    }
    return formdata;
  };

  const onSubmit = async (data: FieldValues) => {
    const formdata = createFormData(data);
    try {
      if (product)
        await UpdateProduct({ id: product.id, data: formdata }).unwrap();
      else await Createproduct(formdata).unwrap();
      setEditMode(false);
      SetSelectedproduct(null);
      refetch();
    } catch (error) {
      console.log(error);
      handelApiError(error, setError, [
        "brand",
        "description",
        "file",
        "name",
        "pictureUrl",
        "quantityInStock",
        "type",
        "price",
      ]);
    }
  };
  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: "lg", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4 }}></Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={3}>
          <Grid2 size={12}>
            <AppTextInput
              control={control}
              name="name"
              label={"Product name"}
            />
          </Grid2>
          <Grid2 size={6}>
            {data?.brand && (
              <AppSelectInput
                items={data.brand}
                control={control}
                name="brand"
                label={"Brand"}
              />
            )}
          </Grid2>
          <Grid2 size={6}>
            {data?.type && (
              <AppSelectInput
                items={data.type}
                control={control}
                name="type"
                label={"Type"}
              />
            )}
          </Grid2>
          <Grid2 size={6}>
            <AppTextInput
              type="number"
              control={control}
              name="price"
              label={"Price"}
            />
          </Grid2>
          <Grid2 size={6}>
            <AppTextInput
              control={control}
              type="number"
              name="quantityInStock"
              label={"QuantityInStock"}
            />
          </Grid2>
          <Grid2 size={12}>
            <AppTextInput
              control={control}
              name="description"
              multiline
              rows={4}
              label="Description"
            />
          </Grid2>
          <Grid2
            size={12}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <AppDropzone control={control} name="file" />
            {previewUrl ? (
              <img
                src={previewUrl}
                alt=" preview of image"
                style={{ maxWidth: "200px" }}
              />
            ) : product?.pictureUrl ? (
              <img
                src={product?.pictureUrl}
                alt=" preview of image"
                style={{ maxWidth: "200px" }}
              />
            ) : null}
          </Grid2>
        </Grid2>
        <Box display={"flex"} justifyContent={"space-between"} sx={{ mt: 3 }}>
          <Button
            onClick={() => setEditMode(false)}
            variant="contained"
            color="inherit"
          >
            cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            color="success"
            type="submit"
          >
            Submit
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
}
