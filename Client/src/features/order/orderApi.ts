import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithError } from "../../app/api/baseapi";
import type { CreateOrder, Order } from "../../app/models/Orders";

export const OrderApi=createApi({
    reducerPath:"OrderApi",
baseQuery:baseQueryWithError,
endpoints:(builder)=>({
    fetchOrder:builder.query<Order[],void>({
        query:()=>"order"
    }),
    fetchOrderDetail:builder.query<Order,number>({
        query:(id)=>`order/${id}`
    }),
    createOrder:builder.mutation<Order,CreateOrder>({
        query:(order)=>({
            url:"order",
            method:"POST",
            body:order
        })
            
        
    })
})
})
export const{useCreateOrderMutation,useFetchOrderDetailQuery,useFetchOrderQuery}=OrderApi;