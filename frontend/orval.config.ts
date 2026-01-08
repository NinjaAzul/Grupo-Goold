import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target:  process.env.ORVARL_TARGET ?? 'http://localhost:3001/api-docs.json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/generated',
      schemas: 'src/api/generated/models',
      client: 'react-query',
      mock: false,
      override: {
        mutator: {
          path: 'src/api/mutator.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: false,
          useInfiniteQueryParam: 'page',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});

