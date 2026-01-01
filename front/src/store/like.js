import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseurl } from "./apirtk";

const user=JSON.parse(localStorage.getItem("user"))
export const  Likepostapi =createApi({
    reducerPath:"likepost",
    baseQuery:fetchBaseQuery({
        baseUrl:baseurl,
        prepareHeaders:async(headers)=>{
            const token =localStorage.getItem("access") || null
            if(token){
                headers.set("Authorization",`Bearer ${token}`)
            }
            headers.set("Content-Type","application/json")
            return headers
        }
    }),
    tagTypes:["like"],
    endpoints:(builder)=>({
        getlike:builder.query({
            query:(id)=>({
                url:`u/like/${id}/`,
                method:"GET"
            }),
            providesTags: (r, e, id) => [
  { type: "like", id }   // like:10
]
        }),
        postlikes:builder.mutation({
            query:(id)=>({
                url:`u/${id}/li/`,
                method:"POST",
                body:null
            }),
            invalidatesTags: (r, e, id) => [
    { type: "like", id }
  ],
            async onQueryStarted(id,{dispatch,queryFulfilled}){
                const likepost=dispatch(
                    Likepostapi.util.updateQueryData(
                        "getlike",
                        id,
                        (draft)=>{
                            const index =draft.findIndex(l=>l.user===user.id)
                            
                            if(!draft) return
                            if(index!==-1){
                                draft.splice(index,1)
                            } else{
                                draft.unshift({
                                id:Date.now(),
                                user:user.id,
                                _optimistic:true
                        })
                            }
                           
                        }
                    )
                )

                try {
                    await queryFulfilled
                } catch (error) {
                    likepost.undo()
                }
            }
        })
    })
})

export const {useGetlikeQuery,usePostlikesMutation}=Likepostapi