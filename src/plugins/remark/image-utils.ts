import { buildHandlerFunction } from '../utils'

const ImageWidthKey = 'data-width'
export const handleImageWidth = buildHandlerFunction<number>(
  ImageWidthKey,
  Number,
)

const ImageHeigghtKey = 'data-heigght'
export const handleImageHeight = buildHandlerFunction<number>(
  ImageHeigghtKey,
  Number,
)

const ImageBase64Key = 'data-base64'
export const handleImagebase64 = buildHandlerFunction<string>(ImageBase64Key)
