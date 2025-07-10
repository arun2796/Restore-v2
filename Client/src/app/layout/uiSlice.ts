import { createSlice } from "@reduxjs/toolkit";

const getinitialdarkMode=()=>{
    const startdarkmode=localStorage.getItem('darkmode')
    return startdarkmode?JSON.parse(startdarkmode):true
}
export const uislice =createSlice({
    name:'ui',
    initialState:{
        isloading:false,
        darkmode:getinitialdarkMode()
    },
    reducers:{
        StartLoading:(state)=>{
            state.isloading=true
        },
        StopLoading:(state)=>{
            state.isloading=false
        },
        SetdarkMode:(state)=>{
          localStorage.setItem('darkmode',JSON.stringify(!state.darkmode))
          state.darkmode=!state.darkmode
        }
    }
})

export const {StartLoading,StopLoading,SetdarkMode}=uislice.actions;