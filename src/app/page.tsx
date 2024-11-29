import ArtlistAll from './list/[id]/[pagenum]/page'

function Home() {
  return <ArtlistAll params={Promise.resolve({ id: 'blog', pagenum: 1 })} />
}

export default Home
