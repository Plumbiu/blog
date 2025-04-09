import { generatePluginKey } from '../optimize-utils'
import { buildHandlerFunction } from '../utils'

const ImageWidthKey = generatePluginKey()
export const handleImageWidth = buildHandlerFunction<number>(
  ImageWidthKey,
  Number,
)

const ImageHeigghtKey = generatePluginKey()
export const handleImageHeight = buildHandlerFunction<number>(
  ImageHeigghtKey,
  Number,
)

const ImageBase64Key = generatePluginKey()
export const handleImagebase64 = buildHandlerFunction<string>(ImageBase64Key)
