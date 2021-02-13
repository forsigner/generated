import { Config } from 'generated-stook-graphql'
import { Names } from '../src/generated/gql-names'

export const stookGraphql: Config = {
  codegen: {
    schema: [
      {
        // 'https://graphql.anilist.co': {},
        'http://localhost:5001/graphql': {},
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
    // {
    //   name: 'User',
    //   actions: ['query', 'useQuery', 'mutator', 'refetch'],
    // },

    // {
    //   alias: 'MyUser',
    //   name: 'User',
    //   actions: ['mutator'],
    // },
    {
      name: Names.tables,
      actions: ['query', 'useQuery', 'mutator', 'refetch'],
    },

    {
      name: Names.addColumn,
      actions: ['mutator'],
    },
  ],
}
