async function getModuleMap(code: string) {
  const moduleMap: Record<string, any> = {}

  // add module like this:
  if (hasMoudle('rxjs')) {
    const rxjs = await import('rxjs')
    moduleMap.rxjs = rxjs
  }

  function hasMoudle(module: string) {
    return code.includes(`require('${module}')`)
  }

  return moduleMap
}

export default getModuleMap
