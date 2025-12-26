import { configureStore } from "@reduxjs/toolkit";
import { apipost } from "./apirtk";



const store=configureStore({
    reducer:{
    [apipost.reducerPath]:apipost.reducer}
        ,
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware().concat(apipost.middleware)
    
})

export default store