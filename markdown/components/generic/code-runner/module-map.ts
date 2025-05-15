// add package name there
const modules = ['rxjs']

async function getModuleMap(code: string) {
  const moduleArr: ([string, any] | undefined)[] = await Promise.all(
    modules.map(async (m) => {
      if (
        code.includes(`require('${m}')`) ||
        code.includes(`require("${m}")`)
      ) {
        const module = await import(m)
        return [m, module]
      }
    }),
  )
  const moduleMap = Object.fromEntries(
    moduleArr.filter(Boolean).map((module) => module!),
  )

  return moduleMap
}

export default getModuleMap
