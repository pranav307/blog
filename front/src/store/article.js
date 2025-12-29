import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseurl } from "./apirtk";

export const Articlertkq = createApi({
  reducerPath: "articleapi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseurl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    }
  }),
  tagTypes: ["Article"],

  endpoints: (builder) => ({
    getuserpostlist: builder.query({
      query: () => "u/plist/",
      providesTags: [{ type: "Article", id: "LIST" }]
    }),

    getarticle: builder.query({
      query: (id) => `u/ard/${id}/`,
      providesTags: (result, error, id) => [
        { type: "Article", id }
      ]
    }),

    articlepatch: builder.mutation({
      query: ({ id, data }) => ({
        url: `u/ard/${id}/`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Article", id },
        { type: "Article", id: "LIST" }
      ]
    }),

    articledelete: builder.mutation({
      query: (id) => ({
        url: `u/ard/${id}/`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Article", id: "LIST" }],

      async onQueryStarted(id,{dispatch,queryFulfilled}){
        const resulthai =dispatch(
          Articlertkq.util.updateQueryData(
            "getuserpostlist",
             undefined, //getuserpostlist query koi argument leti hi nahi:
             (draft)=>{
              if(!draft) return 
              const index =draft.findIndex(item=>item.id ===id)
              if(index !==-1){
                draft.splice(index,1)
              }  //jo match hata do
             }
          )
        )
        try {
           await queryFulfilled
        } catch (error) {
          resulthai.undo()
        }
      }
    })
  })
});

export const {
  useGetuserpostlistQuery,
  useGetarticleQuery,
  useArticledeleteMutation,
  useArticlepatchMutation
} = Articlertkq;
