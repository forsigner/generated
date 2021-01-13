import {
  Project,
  VariableDeclarationKind,
  MethodDeclarationStructure,
  PropertyDeclarationStructure,
  OptionalKind,
} from 'ts-morph'
import { last } from 'lodash'
import { capital } from 'case'
import { join, sep } from 'path'
import { readdirSync } from 'fs'
import { saveSourceFile } from './saveSourceFile'

export function generateStores(generatedDir: string, storesDir: string, moduleSpecifier: string) {
  const project = new Project()
  const outPath = join(generatedDir, 'stores.ts')
  const sourceFile = project.createSourceFile(outPath, undefined, { overwrite: true })
  const paths = readdirSync(storesDir)

  const methods: OptionalKind<MethodDeclarationStructure>[] = []
  const properties: OptionalKind<PropertyDeclarationStructure>[] = []

  for (const item of paths) {
    // const sourceFile = project.addSourceFileAtPath(item)
    // const test = sourceFile.getClass('Test')?.getText()
    // const state = sourceFile.getFunction('useCounter')?.getBodyText()
    // const store = sourceFile.getInterface('Store')?.getFullText()
    // const t = sourceFile.getTypeAlias('State')?.getIndentationText()

    const hookName = last(item.split(sep))?.replace('.ts', '') as string
    const name = hookName.replace(/^use/, '')
    const Name = capital(name, '')

    sourceFile.addImportDeclaration({
      moduleSpecifier: `@stores/${hookName}`,
      namedImports: [hookName, `State as ${Name}State`],
    })

    properties.push({
      name: hookName,
      initializer: hookName,
    })

    methods.push({
      name: `set${Name}`,
      statements: `return mutate<${Name}State>('${name}')`,
    })

    methods.push({
      name: `get${Name}`,
      statements: `return getState<${Name}State>('${name}')`,
    })
  }

  sourceFile.addImportDeclaration({
    moduleSpecifier,
    namedImports: ['getState', 'mutate'],
  })

  sourceFile.addClass({
    name: 'StoresService',
    methods,
    properties,
  })

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'Stores',
        initializer: `new StoresService()`,
      },
    ],
    isExported: true,
  })

  saveSourceFile(sourceFile)
}
