import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseurl } from "./apirtk";

export const Posthome = createApi({
  reducerPath: "postlist",

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

  tagTypes: ["list"],

  endpoints: (builder) => ({

    // GET LIST (category + search)
    getitem: builder.query({
      query: ({ category, search } = {}) => {
        const params = new URLSearchParams();

         if (category) {
      const categoryParam = Array.isArray(category) ? category.join(",") : category; //agar array hai tuh string mai banao 
      params.append("category", categoryParam);
    }
        if (search) params.append("search", search);

        const queryString = params.toString();
        return queryString ? `u/pl/?${queryString}` : `u/pl/`;
      },
      providesTags: ["list"],
    }),

    // CREATE POST
    postcreate: builder.mutation({
      query: (data) => ({
        url: "u/plist/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["list"],

      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          Posthome.util.updateQueryData(
            "getitem",
            {}, // same args as list query
            (draft) => {
              if (!draft) return;
              draft.unshift({
                ...data,
                id: Date.now(),
                _optimistic: true,
              });
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),

    //  GET BY ID
    getbyid: builder.query({
      query: (id) => `u/pl/${id}/`,
    }),

  }),
});

export const {
  useGetitemQuery,
  usePostcreateMutation,
  useGetbyidQuery,
} = Posthome;
