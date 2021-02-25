import { Config } from 'generated-taro-router'

const basePath = process.cwd()

export const taroRouter: Config = {
  pageDir: basePath + '/src',

  appConfigPath: basePath + '/src/app.config.ts',
  projectConfigPath: basePath + '/project.config.json',

  outputFileName: 'routerService',
  navigateFnName: 'navigateTo',
  navigateSpecifier: '@common/utils',
}
