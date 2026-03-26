import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST() {
  const { data: desserts } = await supabaseServer.from('desserts').select('id,title,category')
  const { data: likes } = await supabaseServer.from('dessert_likes').select('dessert_id')
  const { data: pickups } = await supabaseServer
    .from('pickup_requests')
    .select('dessert_id,customer_name,contact,wanted_date,pickup_time')

  const likeMap = new Map<string, number>()
  for (const like of likes ?? []) {
    likeMap.set(like.dessert_id, (likeMap.get(like.dessert_id) ?? 0) + 1)
  }

  const ranked = (desserts ?? [])
    .map((d) => ({
      ...d,
      likes: likeMap.get(d.id) ?? 0,
      pickups: (pickups ?? []).filter((p) => p.dessert_id === d.id),
    }))
    .sort((a, b) => b.likes - a.likes)

  const html = `
    <h1>Weekly Dessert Voting Summary</h1>
    ${ranked
      .map(
        (item, i) => `
        <h2>#${i + 1} ${item.title} (${item.likes} likes)</h2>
        <p>Category: ${item.category}</p>
        <ul>
          ${item.pickups
            .map(
              (p) =>
                `<li>${p.customer_name} | ${p.contact} | ${p.wanted_date} | ${p.pickup_time}</li>`
            )
            .join('')}
        </ul>
      `
      )
      .join('')}
  `

  const result = await resend.emails.send({
    from: 'Dessert Gallery <onboarding@resend.dev>',
    to: process.env.ADMIN_EMAIL!,
    subject: 'Weekly Dessert Voting Summary',
    html,
  })

  return NextResponse.json({ ok: true, result })
}