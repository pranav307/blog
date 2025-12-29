import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseurl } from './apirtk'

export const Posthome = createApi({
  reducerPath: "postlist",
  baseQuery: fetchBaseQuery({
    baseUrl: baseurl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access")

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      headers.set("Content-Type", "application/json")
      return headers
    }
  }),
  tagTypes:["list"],
  endpoints: (builder) => ({
    getitem: builder.query({
      query: () => ({
        url: 'u/pl/',
        method: "GET"
      }),
      providesTags:["list"]
    }),
    postcreate:builder.mutation({
      query:(data)=>({
        url:'u/plist/',
        method:"POST",
        body:data
      }),
      invalidatesTags:["list"],
      async onQueryStarted(data,{dispatch,queryFulfilled}){
        const postdata=dispatch(
          Posthome.util.updateQueryData(
          "getitem" //query name
          ,undefined //for args we pass  in getitem if any
          ,(draft)=>{
            if (!draft) return
          draft.unshift({
           
            ...data,
            id:Date.now(),
            _optimistic:true // optional flag
          })
         })
        )

        try {
            await queryFulfilled
        } catch (error) {
          postdata.undo()
        }
      }
    })
  })
})

export const { useGetitemQuery,usePostcreateMutation } = Posthome
