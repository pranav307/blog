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
  endpoints: (builder) => ({
    getitem: builder.query({
      query: () => ({
        url: 'u/pl/',
        method: "GET"
      })
    })
  })
})

export const { useGetitemQuery } = Posthome
