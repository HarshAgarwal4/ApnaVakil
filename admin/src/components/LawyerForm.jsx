import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import axios from "../services/axios"

export default function LawyerForm({ onClose, onSubmit, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  const buildFormData = (data) => {
    const formData = new FormData()

    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("desc", data.description)
    formData.append("phone", data.contact)

    normalizeCategories(data.categories).forEach(cat =>
      formData.append("categories[]", cat)
    )

    if (data.image?.[0]) {
      formData.append("image", data.image[0])
    }

    return formData
  }

  const normalizeCategories = (categories) => {
    if (Array.isArray(categories)) return categories

    return categories
      .split(",")
      .map(c => c.trim())
      .filter(Boolean)
  }

  const handleFormSubmit = async (data) => {
    console.log(data)
    try {
      const formdata = buildFormData(data)
      const res = await axios.post('/createLawyer', formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      if (res.status == 200) {
        if (res.data.status == 1) {
          toast.success("Lawyer Saved Successfully")
          
        }
        else toast.error("Error in saving lawyer")
      }
    }
    catch (err) {
      console.log(err)
      toast.error("Server error")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-bold text-slate-700">
            {defaultValues ? "Update Lawyer" : "Add Lawyer"}
          </h4>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

          {/* NAME */}
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
              className="w-full p-3 rounded-xl border outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email",
                },
              })}
              className="w-full p-3 rounded-xl border outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* CATEGORIES */}
          <div>
            <input
              type="text"
              placeholder="Categories (comma separated)"
              {...register("categories", {
                required: "At least one category is required",
              })}
              className="w-full p-3 rounded-xl border outline-none"
            />
            {errors.categories && (
              <p className="text-red-500 text-xs mt-1">
                {errors.categories.message}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Example: Criminal Law, Family Law, Corporate Law
            </p>
          </div>

          {/* IMAGE */}
          <div>
            <input
              type="file"
              {...register("image", { required: !defaultValues })}
              className="w-full p-3 rounded-xl border"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <textarea
              rows="3"
              placeholder="Description"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Minimum 10 characters",
                },
              })}
              className="w-full p-3 rounded-xl border outline-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* CONTACT */}
          <div>
            <input
              type="text"
              placeholder="Contact"
              {...register("contact", {
                required: "Contact is required",
                minLength: {
                  value: 10,
                  message: "Minimum 10 digits",
                },
              })}
              className="w-full p-3 rounded-xl border outline-none"
            />
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contact.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            {defaultValues ? "Update Lawyer" : "Save Lawyer"}
          </button>
        </form>
      </div>
    </div>
  )
}
