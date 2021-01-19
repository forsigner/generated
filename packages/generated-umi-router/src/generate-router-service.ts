import {
  Project,
  VariableDeclarationKind,
  MethodDeclarationStructure,
  PropertyDeclarationStructure,
  OptionalKind,
} from 'ts-morph'
// import { last } from 'lodash'
import { capital } from 'case'
// import { join, sep } from 'path'
import { join } from 'path'
// import { readdirSync } from 'fs'
import { saveSourceFile } from './saveSourceFile'

interface FormatedItem {
  pageName: string
  path: string
}

interface RouteItem {
  path: string
  component: string
  routes: RouteItem[]
}

export function generateRouterlService(generatedDir: string, routesConfig: RouteItem[]) {
  const project = new Project()
  const outPath = join(generatedDir, `routerService.tsx`)
  console.log('generatedDir:', generatedDir)
  const sourceFile = project.createSourceFile(outPath, undefined, { overwrite: true })
  const properties: OptionalKind<PropertyDeclarationStructure>[] = []

  sourceFile.addImportDeclaration({
    moduleSpecifier: '@@/core/history',
    namedImports: ['history'],
  })

  const methods: OptionalKind<MethodDeclarationStructure>[] = []

  const formatItems = recursiveConfig(routesConfig)

  function recursiveConfig(routesConfig: RouteItem[], parent = ''): FormatedItem[] {
    return routesConfig.reduce<FormatedItem[]>((result, item) => {
      const { component, routes } = item
      const name = component.replace(/^@\/(pages|layouts)\//, '')
      const pageName = capital(name, '')
      const path = parent ? `${parent}/${item.path}` : item.path

      if (!routes?.length) {
        return [...result, { pageName, path }]
      }

      const currentParent = `${parent}${item.path}`
      return [
        ...result,
        {
          pageName,
          path,
        },
        ...recursiveConfig(routes, currentParent),
      ]
    }, [])
  }

  for (const item of formatItems) {
    const { pageName } = item
    methods.push({
      name: 'to' + pageName,
      parameters: [{ name: 'params?', type: 'any' }],
      statements: `history.push('${item.path}')`,
    })
  }

  sourceFile.addClass({
    name: 'RouterService',
    properties,
    methods,
  })

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'routerService',
        initializer: `new RouterService()`,
      },
    ],
    isExported: true,
  })

  saveSourceFile(sourceFile)
}
