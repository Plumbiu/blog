async function getModuleMap(code: string) {
  const moduleMap: Record<string, any> = {}

  if (hasModule('rxjs')) {
    const rxjs = await import('rxjs')
    moduleMap.rxjs = rxjs
  }

  function hasModule(module: string) {
    return (
      code.includes(`require('${module}')`) ||
      code.includes(`require("${module}")`)
    )
  }

  return moduleMap
}

export default getModuleMap
