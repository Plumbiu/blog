import { ComponentKey } from '../constant'
import { buildPlaygroundHandlerFunction } from '../utils'

export const RunCodeKey = `${ComponentKey}run-code`
export const getRunCode = buildPlaygroundHandlerFunction(RunCodeKey)
