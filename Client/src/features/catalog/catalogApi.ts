import { createApi } from "@reduxjs/toolkit/query/react";
import type { IProduct } from "../../app/models/product";
import { baseQueryWithError } from "../../app/api/baseapi";
import type { ProductsParams } from "../../app/models/ProductParams";
import { FilterValueEmpty } from "../lib/unit";
import type { IPagination } from "../../app/models/Pagination";


export const catalogApi=createApi({
    reducerPath:'catalogApi',
    baseQuery:baseQueryWithError,
    endpoints:(builder)=>({
        fetchproduct:builder.query<{item:IProduct [],pagination:IPagination}, ProductsParams>({
            query:(ProductsParams)=>{
           return{
                url:"Product",
                params:FilterValueEmpty(ProductsParams)
            }},
            transformResponse:(item:IProduct[],meta)=>{
                const fetchpagination=meta?.response?.headers.get("Pagination");
                const pagination=fetchpagination? JSON.parse(fetchpagination):null;
                return{item ,pagination}
            },
        }),
        fetchproductDetails:builder.query<IProduct,number>({
            query:(productid)=>`/product/${productid}`
        }),
        fetchFilter:builder.query<{brand:string[],type:string[]} ,void>({
            query:()=>({
                url:"Product/filter"
            })
        })
    })
})

export const { useFetchproductDetailsQuery,useFetchproductQuery,useFetchFilterQuery}=catalogApi