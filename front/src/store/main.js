import { configureStore } from "@reduxjs/toolkit";
import { apipost } from "./apirtk";
import {Posthome} from "./home"
import {Articlertkq} from "./article"
import { Commentapi } from "./comment";
import { Likepostapi } from "./like";
import { Imageapi } from "./image";

const store=configureStore({
    reducer:{
    [apipost.reducerPath]:apipost.reducer,
    [Posthome.reducerPath]:Posthome.reducer,
    [Articlertkq.reducerPath]:Articlertkq.reducer,
    [Commentapi.reducerPath]:Commentapi.reducer,
    [Likepostapi.reducerPath]:Likepostapi.reducer,
    [Imageapi.reducerPath]:Imageapi.reducer
}
    ,
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware().concat(apipost.middleware,
            Posthome.middleware,Articlertkq.middleware,Commentapi.middleware
        ,Likepostapi.middleware,Imageapi.middleware)
    
})

export default store