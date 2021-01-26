import { EnumMemberStructure, OptionalKind, Project } from 'ts-morph'
import get from 'lodash.get'
import { join } from 'path'
import { readFileSync } from 'fs'
import { ObjectTypeDefinitionNode, parse } from 'graphql'
import saveSourceFile from '../utils/saveSourceFile'

type Operation = 'Query' | 'Mutation'

export async function generateNames() {
  const project = new Project()
  const baseDirPath = process.cwd()
  const outPath = join(baseDirPath, 'src', 'generated', `gql-names.ts`)
  const sdlPath = join(baseDirPath, 'src', 'generated', 'schema.graphql')
  const sdl = parse(readFileSync(sdlPath, { encoding: 'utf8' })) // GraphQL sdl string
  const sourceFile = project.createSourceFile(outPath, undefined, { overwrite: true })

  const members: OptionalKind<EnumMemberStructure>[] = []
  for (const def of sdl.definitions) {
    const operation: Operation = get(def, 'name.value')
    const objectType = def as ObjectTypeDefinitionNode

    if (operation === 'Query' || operation === 'Mutation') {
      objectType.fields?.forEach((field) => {
        members.push({
          name: field.name.value,
          value: field.name.value,
        })
      })
    }
  }

  sourceFile.addEnum({
    isExported: true,
    name: 'Names',
    members,
  })

  await saveSourceFile(sourceFile)
}
