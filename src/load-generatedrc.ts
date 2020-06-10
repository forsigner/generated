import { join } from 'path'
import { readdirSync, existsSync, readFileSync } from 'fs'
import * as ts from 'typescript'
import { GeneratedrcConfig } from './typings'
const requireFromString = require('require-from-string')

export function loadGeneratedrc(): GeneratedrcConfig {
  const cwd = process.cwd()
  const configPath = join(cwd, '.generatedrc.ts')
  if (!existsSync(configPath)) return {}
  const fileString = readFileSync(configPath, { encoding: 'utf8' })
  const code = ts.transpile(fileString)
  const obj = requireFromString(code)
  return obj.default
}
