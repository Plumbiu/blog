import { expect, test } from 'vitest'
import { getAssetImagePath, tryReadFileSync } from '../node/fs'
import packageJson from '~/package.json'
import { existsSync } from 'node:fs'

test('tryReadFileSync', () => {
  const packageJsonPath = 'package.json'
  const nonExistentPath = 'non-existent.json'
  expect(JSON.parse(tryReadFileSync(packageJsonPath))).toEqual(packageJson)
  expect(tryReadFileSync(nonExistentPath)).toBe('')
})

test('tryReadFileSync', () => {
  const imageName = '2022-1.png'
  const imagePath = getAssetImagePath(imageName)
  expect(existsSync(imagePath)).toBe(true)
})
