import { join } from 'path'
import { readdirSync, existsSync, readFileSync } from 'fs'
import * as ts from 'typescript'
const requireFromString = require('require-from-string')

export function loadConfig(configPath = 'gconfig') {
  const cwd = process.cwd()
  const configDir = join(cwd, configPath)
  if (!existsSync(configDir)) return

  const files = readdirSync(configDir)
  return files.reduce((result, cur) => {
    const fileString = readFileSync(join(configDir, cur), { encoding: 'utf8' })
    const code = ts.transpile(fileString)
    const obj = requireFromString(code)

    Object.keys(obj).forEach(k => {
      if (k === 'default') {
        result = { ...result, ...obj[k] }
      } else {
        result[k] = obj[k]
      }
    })

    return result
  }, {} as any)
}
