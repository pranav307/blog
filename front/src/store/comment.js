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

  tagTypes: ["comment"],

  endpoints: (builder) => ({
    
    getcomment: builder.query({
      query: ({ id, parent_id = null, page = 1 }) => ({
        url: `u/cm/?post_id=${id}${
          parent_id ? `&parent=${parent_id}` : ""
        }&page=${page}`,
        method: "GET",
      }),

      //  cache key = post + parent (page ignored)
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { id, parent_id } = queryArgs
        return `${endpointName}-${id}-${parent_id ?? "root"}`
      },

      //  infinite scroll merge
      merge: (currentCache, newData) => {
        if (!currentCache) return newData

        currentCache.results.push(...newData.results)
        currentCache.next = newData.next
        currentCache.count = newData.count
      },

      //  refetch only when page changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page
      },

      providesTags: (result, error, args) => [
        { type: "comment", id: `${args.id}-${args.parent_id ?? "root"}` },
      ],
    }),

    commentpost: builder.mutation({
      query: ({ id, parent_id = null, data }) => ({
        url: `u/cm/ccom/?post_id=${id}${
          parent_id ? `&parent=${parent_id}` : ""
        }`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: (r, e, args) => [
        { type: "comment", id: `${args.id}-${args.parent_id ?? "root"}` },
      ],

      // optimistic update
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const { id, parent_id, data } = args

        const patchResult = dispatch(
          Commentapi.util.updateQueryData(
            "getcomment",
            { id, parent_id },
            (draft) => {
              if (!draft?.results) return

              draft.results.unshift({
                id: Date.now(), // temp id
                content: data.content,
                post: id,
                replies: [],
                replies_count: 0,
                _optimistic: true,
              })

              draft.count += 1
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const {
  useGetcommentQuery,
  useCommentpostMutation,
} = Commentapi
