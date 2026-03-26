import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { getCurrentVotingWindow } from '@/lib/voting'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const voting = getCurrentVotingWindow()

  if (!voting.isOpen) {
    return NextResponse.json({ error: 'Voting is closed' }, { status: 400 })
  }

  const { error } = await supabaseServer.from('dessert_likes').insert({
    dessert_id: body.dessert_id,
    visitor_name: body.visitor_name ?? null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}