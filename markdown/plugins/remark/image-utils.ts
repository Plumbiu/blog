import { generatePluginKey } from '../generate-key'
import { buildHandlerFunction } from '../utils'

const ImageWidthKey = generatePluginKey('width')
export const handleImageWidth = buildHandlerFunction<number>(
  ImageWidthKey,
  Number,
)

const ImageHeightKey = generatePluginKey('height')
export const handleImageHeight = buildHandlerFunction<number>(
  ImageHeightKey,
  Number,
)

const ImageBase64Key = generatePluginKey('base64')
export const handleImagebase64 = buildHandlerFunction<string>(ImageBase64Key)
