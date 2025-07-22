import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithError } from "../../app/api/baseapi";
import type { IProduct } from "../../app/models/product";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithError,
  endpoints: (builder) => ({
    createproduct: builder.mutation<IProduct, FormData>({
      query: (data: FormData) => {
        return {
          url: "product",
          method: "POST",
          body: data,
        };
      },
    }),
    Updateproduct: builder.mutation<void, { id: number; data: FormData }>({
      query: ({ id, data }) => {
        data.append("id", id.toString());
        return {
          url: "product",
          method: "PUT",
          body: data,
        };
      },
    }),
    DeleteProduct: builder.mutation<void, number>({
      query: (id) => {
        return {
          url: `product/${id}`,
          method: "Delete",
        };
      },
    }),
  }),
});

export const { useCreateproductMutation, useUpdateproductMutation ,useDeleteProductMutation} = adminApi;
