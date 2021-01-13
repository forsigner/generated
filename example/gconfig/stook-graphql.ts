import { Config } from 'generated-stook-graphql'

export const stookGraphql: Config = {
  codegen: {
    schema: [
      {
        'https://graphql.anilist.co': {},
      },
    ],
    generates: {
      [process.cwd() + '/src/generated/types.d.ts']: {
        plugins: ['typescript'],
      },
      [process.cwd() + '/src/generated/schema.graphql']: {
        plugins: ['schema-ast'],
      },
    },
  },
  gql: [
    {
      name: 'User',
      actions: ['query', 'useQuery', 'refetch'],
    },
  ],
}
