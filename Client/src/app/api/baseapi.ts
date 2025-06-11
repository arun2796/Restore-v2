import  { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query";
import { StartLoading, StopLoading } from "../layout/uiSlice";

const customebaseurl=fetchBaseQuery({
    baseUrl:"https://localhost:5166/api"
});

const sleep =()=> new Promise(solve=>setTimeout(solve,500));

export const baseQueryWithError=async ( arg:string| FetchArgs,api:BaseQueryApi,extraoption:object)=>{
     api.dispatch(StartLoading());
    await sleep()
    const result= await customebaseurl(arg,api,extraoption)
   api.dispatch(StopLoading());

    if(result.error){
       const{status,data}=result.error
     console.log(status,data);
    }

    return result
}