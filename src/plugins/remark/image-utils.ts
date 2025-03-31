import { generatePluginKey } from '../optimize-utils'
import { buildHandlerFunction } from '../utils'

const ImageWidthKey = generatePluginKey('data-width')
export const handleImageWidth = buildHandlerFunction<number>(
  ImageWidthKey,
  Number,
)

const ImageHeigghtKey = generatePluginKey('data-height')
export const handleImageHeight = buildHandlerFunction<number>(
  ImageHeigghtKey,
  Number,
)

const ImageBase64Key = generatePluginKey('data-base64')
export const handleImagebase64 = buildHandlerFunction<string>(ImageBase64Key)
