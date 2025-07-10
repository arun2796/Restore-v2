import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithError } from "../../app/api/baseapi";
import type { Basket } from "../../app/models/Basket";
import { basketApi } from "../basket/basketApi";

export const checkoutApi=createApi({
    reducerPath:"checkoutApi",
    baseQuery:baseQueryWithError,
    endpoints:(builder)=>({
        createpaymentIntent:builder.mutation<Basket, void>({
             query:()=>{
             return{
                    url:"payment",
                   method:"post"
             }
},
onQueryStarted:async(_,{dispatch,queryFulfilled})=>{
    try {
        const {data} =await queryFulfilled;
        dispatch(
            basketApi.util.updateQueryData("fetchBasket",undefined,(draft)=>{
                draft.clientSecret=data.clientSecret;
            })
        )
    } catch (error) {
        console.log("payment intent create failed:",error)
    }
}
})
    })
});

export const {useCreatepaymentIntentMutation} = checkoutApi;

