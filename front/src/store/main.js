import { configureStore } from "@reduxjs/toolkit";
import { apipost } from "./apirtk";
import {Posthome} from "./home"
import {Articlertkq} from "./article"

const store=configureStore({
    reducer:{
    [apipost.reducerPath]:apipost.reducer,
    [Posthome.reducerPath]:Posthome.reducer,
    [Articlertkq.reducerPath]:Articlertkq.reducer,
}
    ,
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware().concat(apipost.middleware,Posthome.middleware,Articlertkq.middleware)
    
})

export default store