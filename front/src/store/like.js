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
      query: (postId) => ({
        url: `like/`, // this will hit the router endpoint
        method: "GET",
        params: { post: postId }, // backend must filter likes by post
      }),
      providesTags: (result, error, postId) => [{ type: "like", id: postId }],
    }),
    // POST like for a post
    postlikes: builder.mutation({
      query: (postId) => ({
        url: `${postId}/li/`, // matches your Django path("<int:post>/li/")
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [{ type: "like", id: postId }],
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          Likepostapi.util.updateQueryData("getlike", postId, (draft) => {
            const index = draft.findIndex((l) => l.user === user?.id);
            if (index !== -1) draft.splice(index, 1);
            else draft.unshift({ id: Date.now(), user: user?.id, _optimistic: true });
          })
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
