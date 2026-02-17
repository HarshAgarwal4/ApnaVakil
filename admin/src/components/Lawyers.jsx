import { useState, useMemo } from "react"
import LawyerForm from "./LawyerForm"
import { useStore } from "../zustand/store"

export default function Lawyer() {
  const [showForm, setShowForm] = useState(false)
  const [editLawyer, setEditLawyer] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("")

  const { Lawyers } = useStore()
  console.log(Lawyers)
  const [lawyers, setLawyers] = useState(Lawyers.lawyers || [])

  const normalizeCategories = (categories) => {
    if (!categories) return []
    if (Array.isArray(categories)) return categories
    return categories
      .split(",")
      .map(c => c.trim())
      .filter(Boolean)
  }

  /* 🔹 Add / Update */
  const handleAddOrUpdate = (data) => {
    const categories = normalizeCategories(data.categories)

    const image =
      data.image && data.image[0]
        ? URL.createObjectURL(data.image[0])
        : editLawyer?.image || ""

    const payload = {
      ...data,
      categories,
      image,
    }

    if (editLawyer) {
      setLawyers(prev =>
        prev.map(l =>
          l.id === editLawyer.id ? { ...l, ...payload } : l
        )
      )
    } else {
      setLawyers(prev => [
        ...prev,
        {
          id: Date.now(),
          ...payload,
        },
      ])
    }

    setShowForm(false)
    setEditLawyer(null)
  }

  /* 🔹 Collect unique categories */
  const allCategories = useMemo(() => {
    const set = new Set()
    lawyers.forEach(l =>
      l.categories?.forEach(c => set.add(c))
    )
    return [...set]
  }, [lawyers])

  /* 🔹 Filter lawyers */
  const filteredLawyers = useMemo(() => {
    if (!selectedCategory) return lawyers
    return lawyers.filter(l =>
      l.categories?.includes(selectedCategory)
    )
  }, [lawyers, selectedCategory])

  return (
    <div className="min-h-[70vh] rounded-3xl p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-700">⚖️ Lawyers</h3>

        <div className="flex gap-3">
          {/* FILTER */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-xl border bg-white"
          >
            <option value="">All Categories</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold"
          >
            + Add Lawyer
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="space-y-6">
        {filteredLawyers.map(lawyer => (
          <div
            key={lawyer._id}
            className="bg-white rounded-2xl shadow-xl p-6 flex gap-6 items-start hover:shadow-2xl transition"
          >
            {/* IMAGE */}
            <div className="w-28 h-28 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
              {lawyer.images ? (
                <img
                  loading="lazy"
                  src={lawyer.images}
                  alt={lawyer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                  No Image
                </div>
              )}
            </div>

            {/* DETAILS */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-slate-700">
                    {lawyer.name}
                  </h4>
                  <p className="text-sm text-slate-500">{lawyer.email}</p>
                  <p className="text-sm text-slate-500">
                    📞 {lawyer.phone}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditLawyer(lawyer)
                    setShowForm(true)
                  }}
                  className="px-4 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-semibold"
                >
                  Edit
                </button>
              </div>

              {/* CATEGORIES */}
              <div className="flex flex-wrap gap-2 mt-3">
                {lawyer.categories?.map(cat => (
                  <span
                    key={cat}
                    className="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* DESCRIPTION */}
              <p className="mt-3 text-sm text-slate-600">
                {lawyer.desc}
              </p>
            </div>
          </div>
        ))}

        {filteredLawyers.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No lawyers found for this category
          </div>
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <LawyerForm
          onClose={() => {
            setShowForm(false)
            setEditLawyer(null)
          }}
          onSubmit={handleAddOrUpdate}
          defaultValues={editLawyer}
        />
      )}
    </div>
  )
}