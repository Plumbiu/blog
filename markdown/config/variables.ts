export type VariableType = Record<string, any>

const variableMap: VariableType = {
  foo: 'Test',
  bar: {
    test: {
      a: 'Test',
    },
  },
}

export default variableMap
