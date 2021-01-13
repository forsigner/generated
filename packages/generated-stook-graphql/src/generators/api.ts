import {
  Project,
  VariableDeclarationKind,
  MethodDeclarationStructure,
  OptionalKind,
} from 'ts-morph'

import { capital, pascal, upper } from 'case'
import get from 'lodash.get'
import { join } from 'path'
import { readFileSync } from 'fs'
import { parse, ObjectTypeDefinitionNode } from 'graphql'
import saveSourceFile from '../utils/saveSourceFile'
import { formatNamedImports } from '../utils/formatNamedImports'
import { GqlConfig } from '../types'
import { getObjectType } from '../utils/getObjectType'

type Operation = 'Query' | 'Mutation'

export async function generateApi(
  httpModule: string,
  gqlConstantModule: string,
  apiConfig: string[],
  customGql: GqlConfig,
) {
  const project = new Project()
  const baseDirPath = process.cwd()
  const outPath = join(baseDirPath, 'src', 'generated', `api.ts`)
  const sdlPath = join(baseDirPath, 'src', 'generated', 'schema.graphql')
  const sdl = parse(readFileSync(sdlPath, { encoding: 'utf8' })) // GraphQL sdl string
  const sourceFile = project.createSourceFile(outPath, undefined, { overwrite: true })
  const methods: OptionalKind<MethodDeclarationStructure>[] = []
  const argTypes: string[] = []
  const objectTypes: string[] = []
  const gqlNames: string[] = [] // graphQL query name, 例如： USERS、USERS_CONECTION

  // 把 alias 也转换成 name
  const realNames = apiConfig.map((name) => {
    const find = customGql.find((i) => i.alias === name)
    return find ? find.name : name
  })

  for (const def of sdl.definitions) {
    const operation: Operation = get(def, 'name.value')
    const objectType = def as ObjectTypeDefinitionNode

    // 只处理跟节点 Query、Mutation
    if (!['Query', 'Mutation'].includes(operation)) continue
    if (!objectType.fields || !objectType.fields.length) continue

    for (const field of objectType.fields) {
      let argsType: string
      let statements: string
      const queryName = field.name.value
      const args = field.arguments || []

      let objectType = getObjectType(field)

      if (apiConfig.length && !realNames.includes(queryName)) {
        continue
      }

      if (objectType) {
        // 过滤掉
        if (['number', 'boolean'].includes(objectType)) {
          // do nothing
        } else {
          const type = objectType.replace('[]', '')
          if (!objectTypes.includes(type)) objectTypes.push(type)
        }
      }

      const gqlName = upper(queryName, '_')
      const firstArgName = get(args[0], 'name.value')

      // 无参数
      if (!args.length) {
        argsType = 'any'
        statements = `return await query<${objectType}>(${gqlName}, { ...opt, variables: args })`
        // 只有个参数并且叫 input
      } else if (args.length === 1 && firstArgName === 'input') {
        argsType = get(args[0], 'type.type.name.value')
        statements = `return await query<${objectType}>(${gqlName}, { ...opt, variables: { input: args } })`
        // 多参数,或者不叫 input
      } else {
        argsType = `${capital(operation)}${pascal(gqlName)}Args`
        statements = `return await query<${objectType}>(${gqlName}, { ...opt, variables: args })`
      }

      gqlNames.push(gqlName)
      if (argsType !== 'any') argTypes.push(argsType)

      methods.push({
        name: queryName,
        isAsync: true,
        parameters: [
          {
            name: 'args',
            type: `${argsType} = {} as ${argsType}`,
          },
          {
            name: 'opt',
            type: 'Options = {}',
          },
        ],
        statements,
      })
    }
  }

  // import stook-graphql
  sourceFile.addImportDeclaration({
    moduleSpecifier: httpModule,
    namedImports: ['Options', 'query'],
  })

  sourceFile.addImportDeclaration({
    moduleSpecifier: '@generated/types',
    namedImports: [...formatNamedImports(objectTypes, argTypes)],
  })

  sourceFile.addImportDeclaration({
    moduleSpecifier: gqlConstantModule,
    namedImports: [...formatNamedImports(gqlNames)],
  })

  sourceFile.addClass({
    name: 'ApiService',
    methods,
  })

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'apiService',
        initializer: `new ApiService()`,
      },
    ],
    isExported: true,
  })

  await saveSourceFile(sourceFile)
}
