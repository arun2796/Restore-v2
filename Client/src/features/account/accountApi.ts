import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithError } from "../../app/api/baseapi";

import type { LoginSchema } from "../lib/schemas/loginschemas";
import { router } from "../../app/routes/Routes";
import { toast } from "react-toastify";
import type { Address, User } from "../../app/models/User";


export const AccountApi=createApi({
  reducerPath: "accountApi", 
  baseQuery:baseQueryWithError,
  tagTypes: ["user-info"],
  endpoints: (builder) => ({ 
    login:builder.mutation<void,LoginSchema>({
        query:(cruds)=>{
            return {
                url: "/account/login",
                method: "POST",
                body: cruds,
            }
        },
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
            try {
                await queryFulfilled;
                dispatch(AccountApi.util.invalidateTags(["user-info"]));
                toast.success("Login successful!");
            } catch (error) {
                console.error("Login failed:", error);
                toast.error("Login failed. Please check your credentials."); 
            }
        }
    }),
    register:builder.mutation<void,object>({
        query:(cruds)=>{
            return {
                url: "/account/register",
                method: "POST",
                body: cruds,
            }
        },
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
            try {
                await queryFulfilled;
                dispatch(AccountApi.util.invalidateTags(["user-info"]));
                toast.success("Registration successful! Please log in.");
                router.navigate("/login");
            } catch (error) {
                console.error("Registration failed:", error);
                toast.error("Registration failed. Please try again.");
            }
        }
    }),
    userinfo:builder.query<User,void>({
        query:()=>{
            return {
                url: "/account/user-info",
                method: "GET",
            }   
        },
        providesTags:["user-info"]  
  }),
  logout:builder.mutation<void,void>({
    query:()=>{
        return {
            url: "/account/logout",
            method: "POST",
        }},
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                dispatch(AccountApi.util.invalidateTags(["user-info"]));
                router.navigate("/")
        }
    }),
    fetchAddress:builder.query<Address,void>({
        query:()=>({
            url:'account/address',
            method:"GET"
        })
    }),
    UpdateUserAddress:builder.mutation<Address,Address>({
        query:(Address)=>{
            return {
                url:'account/address',
                method:"Post",
                body:Address
            }
        },
       onQueryStarted:async (Address,{dispatch ,queryFulfilled})=>{
         const patchresult=dispatch(
            AccountApi.util.updateQueryData("fetchAddress",undefined,(draft)=>{
                Object.assign(draft,{...Address})
            })
         );
         try {
            await queryFulfilled;    
         } catch (error) {
            patchresult.undo();
            console.log(error);
         }
       }
    })
    
    })})

    export const { useLoginMutation, useRegisterMutation, useUserinfoQuery,
         useLogoutMutation ,useLazyUserinfoQuery,useFetchAddressQuery, useUpdateUserAddressMutation } = AccountApi;