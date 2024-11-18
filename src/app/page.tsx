'use server'

import { redirect } from 'next/navigation'

function Home(id: string) {
  redirect('blog')
}

export default Home
