import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export const baseurl="https://blog-production-14ae.up.railway.app/"
export const access=localStorage.getItem("access") || null
export const user=JSON.parse(localStorage.getItem("user")) || null
export const refresh=localStorage.getItem("refresh") || null
export const apipost=createApi({
    reducerPath:"authapi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseurl,
        // credentials:'include',
        prepareHeaders:async(headers)=>{
           headers.set('content-type','application/json')
           return headers
        }
    }),
    endpoints:(builder)=>({
        Signapi:builder.mutation({
         query:(data)=>({
            url:'u/re/',
            method:"POST",
            body:data
         })
}),
// login api mutation
loginapi:builder.mutation({
    query:(data)=>({
        url:"u/to/",
        method:"POST",
        body:data
    }),
    async onQueryStarted(args,{queryFulfilled}){
        // Best way: mutation().unwrap() for setting reponse to storage
        try {
            const {data} =await queryFulfilled
            localStorage.setItem("access",data.access)
            localStorage.setItem("refresh",data.refresh)
            localStorage.setItem("user",JSON.stringify(data.user))
        } catch (error) {
            console.error("api fail",error)
        }
        

    }
})
})
})

export const {useSignapiMutation,useLoginapiMutation} =apipost
