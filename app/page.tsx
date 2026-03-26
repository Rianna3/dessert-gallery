'use client'

import { useEffect, useMemo, useState } from 'react'

type Dessert = {
  id: string
  category: 'Box Cake' | 'Birthday Cake' | 'Basque' | 'Other Desserts'
  title: string
  description: string
  image_url: string
}

const categories = ['Box Cake', 'Birthday Cake', 'Basque', 'Other Desserts'] as const

export default function HomePage() {
  const [desserts, setDesserts] = useState<Dessert[]>([])
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('Box Cake')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/desserts')
      .then((res) => res.json())
      .then((data) => setDesserts(data))
  }, [])

  const filtered = useMemo(() => {
    return desserts.filter(
      (d) =>
        d.category === activeCategory &&
        (d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.description.toLowerCase().includes(search.toLowerCase()))
    )
  }, [desserts, activeCategory, search])

  return (
    <main className="min-h-screen bg-rose-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-5xl">小杜·露丽屋</h1>
        <p className="mt-3 text-slate-600">
          自制甜品展示区，可浏览、点赞、预约取餐，还可以提出你想吃的新甜品！
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 ${
                activeCategory === cat ? 'bg-black text-white' : 'bg-white text-slate-800 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          className="mt-4 w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400"
          placeholder="Search desserts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dessert) => (
            <DessertCard key={dessert.id} dessert={dessert} />
          ))}
        </div>

        <div className="mt-10">
          <NewDessertIdeaForm />
        </div>
      </div>
    </main>
  )
}

function DessertCard({ dessert }: { dessert: Dessert }) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [date, setDate] = useState('')
  const [pickup, setPickup] = useState('')
  const [requestText, setRequestText] = useState('')

  async function likeDessert() {
    await fetch('/api/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dessert_id: dessert.id, visitor_name: name || null }),
    })
    alert('Liked')
  }

  async function submitPickup() {
    await fetch('/api/pickup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dessert_id: dessert.id,
        customer_name: name,
        contact,
        wanted_date: date,
        pickup_time: pickup,
        notes: requestText,
      }),
    })
    alert('Pickup request sent')
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <img src={dessert.image_url} alt={dessert.title} className="aspect-[4/3] w-full object-cover" />
      <div className="space-y-3 p-4">
        <h2 className="text-xl font-semibold text-slate-900">{dessert.title}</h2>
        <p className="text-sm text-slate-700">{dessert.description}</p>

        <button onClick={likeDessert} className="w-full rounded-full bg-rose-200 px-4 py-2 text-slate-900 font-medium">
          Like
        </button>

        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Phone or WeChat"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <input
          className="w-full rounded-xl border px-3 py-2"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Available pickup time"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
        <textarea
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Extra notes"
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
        />
        <button onClick={submitPickup} className="w-full rounded-full bg-black px-4 py-2 text-white">
          Submit pickup request
        </button>
      </div>
    </div>
  )
}

function NewDessertIdeaForm() {
  const [customerName, setCustomerName] = useState('')
  const [contact, setContact] = useState('')
  const [requestText, setRequestText] = useState('')

  async function submitIdea() {
    await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: customerName,
        contact,
        request_text: requestText,
      }),
    })
    alert('Idea submitted')
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        提出新的甜品创意
      </h2>

    <input
      className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400"
      placeholder="你的名字"
      value={customerName}
      onChange={(e) => setCustomerName(e.target.value)}
    />

    <input
      className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400"
      placeholder="联系方式（微信/电话）"
      value={contact}
      onChange={(e) => setContact(e.target.value)}
    />

    <textarea
      className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400"
      placeholder="比如：抹茶提拉米苏 / 开心果巴斯克 / 芋泥盒子蛋糕"
      value={requestText}
      onChange={(e) => setRequestText(e.target.value)}
    />

    <button
      onClick={submitIdea}
      className="mt-4 w-full rounded-full bg-black px-4 py-2 text-white"
    >
      提交创意
    </button>
  </div>
  )
}