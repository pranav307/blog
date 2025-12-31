import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseurl } from "./apirtk";

export const Commentapi =createApi({
    reducerPath:"commentapi",
    baseQuery:fetchBaseQuery({
        baseUrl:baseurl,
        prepareHeaders:async (headers)=>{
            const token =localStorage.getItem("access") || null
            if(token){
                headers.set("Authorization",`Bearer ${token}`)
            }
            headers.set("Content-Type","application-json")
            return headers
        }
    }),
    tagTypes:["comment"],

    endpoints:(builder)=>({
        getcomment:builder.query({
          query:({id,parent_id})=>({
            url:`u/cm/?post_id=${id}${parent_id ?`&parent=${parent_id}`:""}`,
            method:"GET",
            
          }),
         providesTags:(r,e,args)=>[
            {type:"comment",id:args.id,par:args?.parent_id}
         ]
        }),
        commentpost:builder.mutation({
            query:({id,parent_id,data})=>({
                url:`u/cm/?post_id=${id}${parent_id ? `&parent=${parent_id}` :""}`,
                method:"POST",
                body:data
            }),
             providesTags:(r,e,args)=>[
            {type:"comment",id:args.id,par:args?.parent_id}
         ],
            async onQueryStarted({args,data},{dispatch,queryFulfilled}){
                const postres =dispatch(
                    Commentapi.util.updateQueryData(
                        "getcomment",
                        args,
                        (draft)=>{
                            if (!draft) return
                            draft.unshift({
                                ...data,
                                id:Date.now(),
                                _optimistic:true
                            })
                        }
                    )
                )
                try {
                    await queryFulfilled
                } catch (error) {
                    postres.undo()
                }
            }
        })
    })
})

export const {useCommentpostMutation,useGetcommentQuery} =Commentapi