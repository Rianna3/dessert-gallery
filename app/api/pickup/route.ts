import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { error } = await supabaseServer.from('pickup_requests').insert({
    dessert_id: body.dessert_id,
    customer_name: body.customer_name,
    contact: body.contact,
    wanted_date: body.wanted_date,
    pickup_time: body.pickup_time,
    notes: body.notes ?? null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}