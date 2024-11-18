import ArtlistAll from './[id]/page'

function Home() {
  return <ArtlistAll params={Promise.resolve({ id: 'blog' })} />
}

export default Home
