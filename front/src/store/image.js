import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseurl } from "./apirtk";


export const Imageapi=createApi({
    reducerPath:"imgapi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseurl,
        prepareHeaders:async(headers)=>{
             const token = localStorage.getItem("access")
      if (token) headers.set("Authorization", `Bearer ${token}`)
      headers.set("Content-Type", "application/json")
      return headers
    
        }
    }),
    endpoints:(builder)=>({
        postimage:builder.mutation({
            query:({id,data})=>({
                url:`u/me/${id}/`,
                method:"POST",
                body:data
            
            })
        })
    })
})

export const {usePostimageMutation}=Imageapi