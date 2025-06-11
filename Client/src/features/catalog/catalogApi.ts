import { createApi } from "@reduxjs/toolkit/query/react";
import type { IProduct } from "../../app/models/product";
import { baseQueryWithError } from "../../app/api/baseapi";


export const catalogApi=createApi({
    reducerPath:'catalogApi',
    baseQuery:baseQueryWithError,
    endpoints:(builder)=>({
        fetchproduct:builder.query<IProduct [], void>({
            query:()=>({
                url:"Product",
            })
        }),
        fetchproductDetails:builder.query<IProduct,number>({
            query:(productid)=>`/product/${productid}`
        })
    })
})

export const { useFetchproductDetailsQuery,useFetchproductQuery}=catalogApi