import { create } from 'zustand'
import axios from '../services/axios'
import { toast } from 'react-toastify'

export const useStore = create((set) => ({
    user: null,
    role: null,
    loading: false,

    allUsers: {
        isloading: false,
        users: []
    },

    AllPayments: {
        isloading: false,
        payments: []
    },

    contacts: {
        isloading: false,
        contacts: []
    },

    Lawyers: {
        isloading: false,
        lawyers: []
    },

    fetchUser: async () => {
        set({ loading: true })
        try {
            const res = await axios.get('/me')
            if (res.status === 200) {
                const { status, data } = res.data
                if (status !== 1) {
                    return toast.error('User fetch failed')
                }

                set({
                    user: data,
                    role: data.role
                })

                toast.success('User fetched successfully')
            }
        } catch {
            console.log(err)
            toast.error('Server error')
        } finally {
            set({ loading: false })
        }
    },

    fetchAllUsers: async () => {
        set((state) => ({
            allUsers: { ...state.allUsers, isloading: true }
        }))

        try {
            const res = await axios.post('/getUsers')

            if (res.status === 200 && res.data.status === 1) {
                set((state) => ({
                    allUsers: {
                        ...state.allUsers,
                        users: res.data.users,
                        isloading: false
                    }
                }))
            } else {
                toast.error('Could not fetch users')
            }
        } catch {
            toast.error('Server error')
        } finally {
            set((state) => ({
                allUsers: { ...state.allUsers, isloading: false }
            }))
        }
    },

    fetchPayments: async () => {
        set((state) => ({
            AllPayments: { ...state.AllPayments, isloading: true }
        }))

        try {
            const res = await axios.post('/getAllPayments')

            if (res.status === 200 && res.data.status === 1) {
                set((state) => ({
                    AllPayments: {
                        ...state.AllPayments,
                        payments: res.data.payments,
                        isloading: false
                    }
                }))
            } else {
                toast.error('Could not fetch payments')
            }
        } catch (err) {
            console.error(err)
            toast.error('Server error')
        } finally {
            set((state) => ({
                AllPayments: { ...state.AllPayments, isloading: false }
            }))
        }
    },

    fetchContacts: async () => {
        set((state) => ({
            contacts: { ...state.contacts, isloading: true }
        }))
        try {
            const res = await axios.post('/getAllContact')
            if (res.status === 200 && res.data.status === 1) {
                set((state) => ({
                    contacts: {
                        ...state.contacts,
                        contacts: res.data.contacts,
                        isloading: false
                    }
                }))
            } else {
                toast.error('Could not fetch contacts')
            }
        } catch (err) {
            console.error(err)
            toast.error('Server error')
        } finally {
            set((state) => ({
                contacts: { ...state.contacts, isloading: false }
            }))
        }
    },

    fetchLawyer: async () => {
        set((state) => ({
            Lawyers: { ...state.Lawyers, isloading: true }
        }))
        try {
            const res = await axios.post('/fetchLawyer')
            if (res.status === 200 && res.data.status === 1) {
                console.log(res.data.lawyers)
                set((state) => ({
                    Lawyers: {
                        ...state.Lawyers,
                        lawyers: res.data.lawyers,
                        isloading: false
                    }
                }))
            } else {
                toast.error('Could not fetch lawyers')
            }
        } catch (err) {
            console.error(err)
            toast.error('Server error')
        } finally {
            set((state) => ({
                Lawyers: { ...state.Lawyers, isloading: false }
            }))
        }
    }
}))
