import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { error } = await supabaseServer.from('dessert_queries').insert({
    customer_name: body.customer_name,
    contact: body.contact,
    request_text: body.request_text,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}