import { configureStore } from "@reduxjs/toolkit";
import { apipost } from "./apirtk";
import {Posthome} from "./home"


const store=configureStore({
    reducer:{
    [apipost.reducerPath]:apipost.reducer,
    [Posthome.reducerPath]:Posthome.reducer
}
    ,
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware().concat(apipost.middleware,Posthome.middleware)
    
})

export default store