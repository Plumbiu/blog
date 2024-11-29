import ArtlistAll from './[pagenum]/page'

export default function Art() {
  return (
    <ArtlistAll
      params={Promise.resolve({
        id: 'blog',
        pagenum: 1,
      })}
    />
  )
}
