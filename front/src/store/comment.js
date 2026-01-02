import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseurl } from "./apirtk"

export const Commentapi = createApi({
  reducerPath: "commentapi",

  baseQuery: fetchBaseQuery({
    baseUrl: baseurl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access")
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  tagTypes:["comment"],
  endpoints: (builder) => ({

    // ================= GET COMMENTS =================
    getcomment: builder.query({
      query: ({ id, parent_id = null, page = 1 }) => ({
        url: `u/cm/?post_id=${id}${
          parent_id ? `&parent=${parent_id}` : ""
        }&page=${page}`,
        method: "GET",
      }),
      providesTags:(r,e,args)=>[{type:"comment",id:args}]

      //  ONE cache per post + parent (page ignored)
      // serializeQueryArgs: ({ endpointName, queryArgs }) => {
      //   const { id, parent_id } = queryArgs
      //   return `${endpointName}-${id}-${parent_id ?? "root"}`
      // },

      //  infinite scroll merge
      // merge: (currentCache, newData) => {
      //   if (!currentCache) return newData
      //   currentCache.results.push(...newData.results)
      //   currentCache.next = newData.next
      //   currentCache.count = newData.count
      // },

      // page change pe hi refetch
      // forceRefetch({ currentArg, previousArg }) {
      //   return currentArg?.page !== previousArg?.page
      // },
    }),
commentpost: builder.mutation({
  query: ({ id, parent_id = null, data }) => ({
    url: `u/cm/ccom/?post_id=${id}${
      parent_id ? `&parent=${parent_id}` : ""
    }`,
    method: "POST",
    body: data,
  }),
  invalidatesTags:(r,e,args)=>[{type:"comment",id:args}]

//   async onQueryStarted(args, { dispatch, queryFulfilled }) {
//     const { id, parent_id } = args

//     try {
//       const { data: newComment } = await queryFulfilled

//       // 1 update replies list (nested)
//       dispatch(
//         Commentapi.util.updateQueryData(
//           "getcomment",
//           { id, parent_id, page: 1 },
//           (draft) => {
//             if (!draft?.results) return
//             draft.results.unshift(newComment)
//             draft.count += 1
//           }
//         )
//       )

//       //  update parent replies_count (only if nested)
//       if (parent_id) {
//         dispatch(
//           Commentapi.util.updateQueryData(
//             "getcomment",
//             { id, parent_id: null, page: 1 },
//             (draft) => {
//               const parent = draft.results.find(
//                 (c) => c.id === parent_id
//               )
//               if (parent) {
//                 parent.replies_count += 1
//               }
//             }
//           )
//         )
//       }
//     } catch (err) {
//       console.error("reply failed", err)
//     }
//   },
 }),

  }),
})

export const {
  useGetcommentQuery,
  useCommentpostMutation,
} = Commentapi
