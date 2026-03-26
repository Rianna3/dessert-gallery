'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [category, setCategory] = useState('Box Cake')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  async function submitDessert() {
    const res = await fetch('/api/admin/add-dessert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, title, description, image_url: imageUrl }),
    })

    if (res.ok) alert('Dessert added')
    else alert('Failed')
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-3xl font-semibold">Admin upload</h1>

      <select
        className="mt-4 w-full rounded-xl border px-3 py-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Box Cake</option>
        <option>Birthday Cake</option>
        <option>Basque</option>
        <option>Other Desserts</option>
      </select>

      <input
        className="mt-3 w-full rounded-xl border px-3 py-2"
        placeholder="Dessert title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="mt-3 w-full rounded-xl border px-3 py-2"
        placeholder="Dessert description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="mt-3 w-full rounded-xl border px-3 py-2"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <button onClick={submitDessert} className="mt-4 w-full rounded-full bg-black px-4 py-2 text-white">
        Add dessert
      </button>
    </main>
  )
}