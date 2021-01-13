import { generate } from '@graphql-codegen/cli'
import { PluginOptions } from 'generated'
import { Config } from './types'
import { generateGql } from './generators/gql'
import { generateHooks } from './generators/hooks'
import { generateApi } from './generators/api'
import { generateRefetcher } from './generators/refetcher'

export * from './types'

export default async (options = {} as PluginOptions) => {
  const config: Config = options.config.stookGraphql
  if (!config) return
  const codegenConfig = config.codegen

  // use graphql-codegen
  await generate(codegenConfig, true)

  const {
    gqlConstantModule = '@generated/gql',
    httpModule = 'stook-graphql',
    gql = [],
    // defaultDepthLimit = 2,
  } = config

  const hooks = gql
    .filter((i) => i.actions?.includes('useQuery') || i.actions?.includes('useMutate'))
    .map((i) => i.alias || i.name) as string[]

  const query = gql
    .filter((item) => item.actions?.includes('query'))
    .map((item) => item.alias || item.name)

  const refetch = gql.filter((i) => i.actions?.includes('refetch')).map((i) => i.alias || i.name)

  const promises = [
    generateGql(gql),
    generateHooks(httpModule, gqlConstantModule, hooks, gql),
    generateApi(httpModule, gqlConstantModule, query, gql),
    generateRefetcher(httpModule, gqlConstantModule, refetch, gql),
  ]

  await Promise.all(promises)
}
