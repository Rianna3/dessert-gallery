import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { error } = await supabaseServer.from('desserts').insert({
    category: body.category,
    title: body.title,
    description: body.description,
    image_url: body.image_url,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}