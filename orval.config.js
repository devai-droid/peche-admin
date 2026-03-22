module.exports = {
  "peche-backend": {
    output: {
      target: "src/lib/orval/store.ts",
      schemas: "src/lib/orval/model",
      client: "react-query",
      mode: "tags-split",
      override: {
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: "page",
        },
        mutator: {
          path: "src/lib/api/http-client.ts",
          name: "customInstance",
        },
      },
    },
    input: {
      target: process.env.BACKEND_API_URL
        ? `${process.env.BACKEND_API_URL}/docs-json`
        : 'https://base.pecheskin.clinic/api/docs-json',
      validation: false,
    },
  },
}
