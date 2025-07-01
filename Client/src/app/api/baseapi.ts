
import  { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query";
import { StartLoading, StopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { router } from "../routes/Routes";

const customebaseurl=fetchBaseQuery({
    baseUrl:"https://localhost:5166/api",
    credentials:"include",

});


const sleep =()=> new Promise(solve=>setTimeout(solve,500));

type ErropResponse=string|{title:string}|{errors:string[]}| { title: string; status: number; detail: string };

export const baseQueryWithError=async ( arg:string| FetchArgs,api:BaseQueryApi,extraoption:object)=>{
     api.dispatch(StartLoading());
    await sleep()
    const result= await customebaseurl(arg,api,extraoption)
   api.dispatch(StopLoading());

    if(result.error){
    const statusCode =
     result.error?.status === "PARSING_ERROR" && result.error?.originalStatus
    ? result.error.originalStatus
    : result.error?.status;

    const responsedata=result.error.data as ErropResponse;
     console.log(result.error.data);
     switch (statusCode) {
        case 400:
            if(typeof responsedata==="string")toast.error(responsedata )
                else if( 'errors' in responsedata){
            throw Object.values(responsedata.errors).flat().join(',');
            }
            else{
                toast.error(responsedata.title)
            }
            break;
         case 401:
              if (typeof responsedata === "object" && 'title' in responsedata) {
                 toast.error(responsedata.title);
              } 
        break;
        case 404:
            if (typeof responsedata === 'object' && 'title' in responsedata) {
          router.navigate("/not-found",{state:{error:responsedata}});
              } 
          break;
        //   case 500:
        //     debugger
        //     if ( responsedata && typeof responsedata === 'object') {
        //     router.navigate("/server-error",{state:{error:responsedata}})
        //       } 
        //       console.log( typeof responsedata);
        //    break;  
        case 500: {

  let parsedError = responsedata;

  if (typeof responsedata === 'string') {
    try {
      parsedError = JSON.parse(responsedata);
    } catch (e) {
      console.error("Failed to parse server error string:", e);
    }
  }

  if (
    parsedError &&
    typeof parsedError === 'object' &&
    'title' in parsedError &&
    'detail' in parsedError
  ) {
    router.navigate("/server-error", { state: { error: parsedError } });
  }

  console.log("Final type:", typeof parsedError);
  break;
}
        default:
            break;
        
     }
    }

    return result

}

