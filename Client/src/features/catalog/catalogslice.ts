import { createSlice } from "@reduxjs/toolkit";
import type { ProductsParams } from "../../app/models/ProductParams";

const initialState:ProductsParams={
    PageNumber:1,
    PageSize:6,
    brands:[],
    types:[],
    searchName:"",
    orderBy:"name"  
}

export const catalogSlice=createSlice({
    name:"catalogSlice",
    initialState,
    reducers:{
        setPageNumber(state,action){
             state.PageNumber=action.payload
        },
        setPageSize(state,action){
            state.PageSize=action.payload
        },
        setOrderBy(state,action){
            state.orderBy=action.payload
            state.PageNumber=1
        },
        setBrands(state,action){
            state.brands=action.payload
            state.PageNumber=1
        },
        setType(state,action){
            state.types=action.payload
            state.PageNumber=1
        },
        setSearchName(state,action){
            state.searchName=action.payload
            state.PageNumber=1
        },
        setresetParams(){
             return initialState
        }
    }
});

export const{setBrands,setOrderBy,setPageNumber,setPageSize,setSearchName,setType,setresetParams}=catalogSlice.actions