import { create } from 'zustand'
import axios from '../services/axios'
import { toast } from 'react-toastify'

export const useStore = create((set) => ({
    user: null,
    loading: false,
    role: null,

    fetchUser: async () => {
        set({ loading: true })
        try {
            const res = await axios.get('/me')

            if (res.status === 200) {
                const { status, data } = res.data
                if (status === 0) return toast.error('Something went wrong')
                if (status === 2) return toast.error('Invalid User')
                if (status === 8) return toast.error('Unauthorized access')
                if (status === 10) return toast.error('User not found')
                if (status === 1) {
                    toast.success('User fetched successfully')
                    set({ user: res.data.data })
                    set({ role: res.data.data.role})
                }
            }
        } catch (err) {
            toast.error('Server error')
        } finally {
            set({ loading: false })
        }
    }
}))
