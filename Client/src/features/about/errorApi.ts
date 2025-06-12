
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithError } from "../../app/api/baseapi";



export const errorApi=createApi({
    reducerPath:'errorapi',
    baseQuery:baseQueryWithError,
    endpoints:(builder)=>({
        get404Error:builder.query<void,void>({
            query:()=>({url:'buggy/not-found'})
        }),
        get400Error:builder.query<void,void>({
            query:()=>({url:"buggy/bad-request"})
        }),
        get401Error:builder.query<void,void>({
            query:()=>({url:"/buggy/unauthorized"})
        }),
        get500Error:builder.query<void,void>({
            query:()=>({url:"buggy/server-error"})
        }),
        getValitationError:builder.query<void,void>({
            query:()=>({url:"buggy/validation-error"})
        })
        
    })

})
export const { useLazyGet400ErrorQuery,
    useLazyGet401ErrorQuery,
    useLazyGet404ErrorQuery,
    useLazyGet500ErrorQuery,
    useLazyGetValitationErrorQuery }=errorApi;