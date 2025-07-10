import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithError } from "../../app/api/baseapi";
import { Item, type Basket } from "../../app/models/Basket";
import type { IProduct } from "../../app/models/product";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const IsBasktItems = (product: IProduct | Item): product is Item => {
    return (product as Item).quantity !== undefined;
}
export const basketApi =createApi({
    reducerPath:'basketApi',
    baseQuery:baseQueryWithError,
    tagTypes:["Basket"],
    endpoints:(builder)=>({
        fetchBasket:builder.query<Basket ,void>({
            query:()=>({
                url:"basket",
                providesTags:["Basket"]
            })
        }),
        addBasketItem:builder.mutation<Basket,{product :IProduct|Item,quantity:number}>({
            query:({product,quantity})=>{
                const ProductId=IsBasktItems(product)? product.productId:product.id;
               return{
                 url:`basket?productId=${ProductId}&quantity=${quantity}`,
                method:"POST"
               }
            },
            onQueryStarted:async({product,quantity},{dispatch,queryFulfilled})=>{
                let isNewBasket=false;
              const patchresult=dispatch(
                basketApi.util.updateQueryData("fetchBasket",undefined,(draft)=>{
                   
                 const ProductId=IsBasktItems(product)?product.productId:product.id

                 if(!draft?.basketId) isNewBasket=true;
                    if(!isNewBasket){
                        const exrictingItem=draft.items.find(x=>x.productId===ProductId)
                    
                    if(exrictingItem) exrictingItem.quantity+=quantity
                    else {
                        draft.items.push(IsBasktItems(product)?product:{...product,productId:product.id,quantity})
                    }
                    }
                     
                })
               
              )
                try {
                    await queryFulfilled;
                    toast.success("Item added to basket!");
                if(isNewBasket)   dispatch(basketApi.util.invalidateTags(["Basket"]))
                    
                } catch (error) {
                    patchresult.undo();
                    toast.error("Failed to add item.");
                    console.log(error);     
                }
            }
        }),
        removeBasketItem:builder.mutation<void,{productId :number,quantity:number}>({
            query:({productId,quantity})=>({
                url:`basket?productId=${productId}&quantity=${quantity}`,
                method:"DELETE"
                
            }),
            onQueryStarted:async ({productId,quantity} ,{dispatch ,queryFulfilled})=>{
                const patchresult=dispatch(
                    basketApi.util.updateQueryData("fetchBasket",undefined,(draft)=>{
                        const ItemIndex=draft.items.findIndex(x=>x.productId===productId);
                        if(ItemIndex>=0) draft.items[ItemIndex].quantity-=quantity
                        if(draft.items[ItemIndex].quantity<=0)
                            draft.items.splice(ItemIndex ,1);
                    })
                )
                try {
                    await queryFulfilled
                } catch (error) {
                    patchresult.undo();
                    console.log(error);
                }
            },
            
        }),clearBasket:builder.mutation<void,void>({
            queryFn:()=>({data:undefined}),
            onQueryStarted:async (_, {dispatch})=>{
                dispatch(basketApi.util.updateQueryData("fetchBasket",undefined,(draft)=>{
                    draft.items=[];
                }));
                Cookies.remove("basketId");
            }
        })
    })
});

export const { useFetchBasketQuery,useAddBasketItemMutation,useRemoveBasketItemMutation,useClearBasketMutation}=basketApi