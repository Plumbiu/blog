export function transfromId(id: string) {
  id = id.replace(/\s+/g, '-')
  id = id.replace(/[^a-zA-Z0-9-_]/g, '')
  return id.toLowerCase()
}
