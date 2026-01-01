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
            headers.set("Content-Type", "application/json")
            return headers
        }
    }),
    tagTypes:["comment"],

    endpoints:(builder)=>({
        getcomment:builder.query({
          query:({id,parent_id,page=1})=>({
            url:`u/cm/?post_id=${id}${parent_id ?`&parent=${parent_id}`:""}$page=${page}`,
            method:"GET",
            
          }),  
          serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { id, parent_id } = queryArgs
        return `${endpointName}-${id}-${parent_id ?? "root"}`
      },
        //  append new pages instead of replace
      merge: (currentCache, newData) => {
        if (!currentCache?.results) return newData
        currentCache.results.push(...newData.results)
        currentCache.next = newData.next
      },

      //  refetch only when page changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page
      },
              providesTags: (result, error, args) => [
        { type: "comment", id: `${args.id}-${args.parent_id ?? "root"}` },
      ],
    }),


        commentpost:builder.mutation({
            query:({id,parent_id,data})=>({
                url:`u/cm/ccom/?post_id=${id}${parent_id ? `&parent=${parent_id}` :""}`,
                method:"POST",
                body:data
            }),
             invalidatesTags: (r, e, args) => [
        { type: "comment", id: `${args.id}-${args.parent_id ?? "root"}` },
      ],
            async onQueryStarted(args,{dispatch,queryFulfilled}){
                const {id,parent_id,data} =args
                const postres =dispatch(
                    Commentapi.util.updateQueryData(
                        "getcomment",
                        {id,parent_id,page:1},
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