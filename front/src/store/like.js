import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseurl } from "./apirtk";

const user = JSON.parse(localStorage.getItem("user"));

export const Likepostapi = createApi({
  reducerPath: "likepost",
  baseQuery: fetchBaseQuery({
    baseUrl: baseurl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["like"],
  endpoints: (builder) => ({
    // GET likes for a post
    getlike: builder.query({
      query: ({postId}) => ({
        url: `u/like/glike/?post=${postId}`, // this will hit the router endpoint
        method: "GET",
        // backend must filter likes by post
      }),
      providesTags: (result, error, postId) => [{ type: "like", id: postId }],
    }),
    // POST like for a post
   postlikes: builder.mutation({
  query: ({ postId }) => ({
    url: `u/like/?post=${postId}`,
    method: "POST",
  }),
  invalidatesTags: (result, error, { postId }) => [
    { type: "like", id: postId },
  ],

  async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
    const patch = dispatch(
      Likepostapi.util.updateQueryData(
        "getlike",
        { postId },
        (draft) => {
          if (typeof draft?.liked === "boolean") {
            draft.liked = !draft.liked;
          }
        }
      )
    );

    try {
      await queryFulfilled;
    } catch {
      patch.undo();
    }
  },
}),

  }),
});

export const { useGetlikeQuery, usePostlikesMutation } = Likepostapi;
