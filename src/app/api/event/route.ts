import { initFields } from '@plumbiu/github-info'
import { NextResponse } from 'next/server'

export async function GET() {
  const { eventsField } = await initFields('Plumbiu')
  const events = await eventsField()
  return NextResponse.json(events)
}
