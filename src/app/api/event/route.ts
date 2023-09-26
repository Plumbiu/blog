import { NextResponse } from 'next/server'

export async function GET() {
  const raw = await fetch('https://api.github.com/users/Plumbiu/events')
  const events = await raw.json()
  return NextResponse.json(events)
}
