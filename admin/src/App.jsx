import { RouterProvider } from "react-router-dom";
import router from "./services/Routes";
import { ToastContainer } from "react-toastify";
import { useStore } from './zustand/store'
import { useEffect } from 'react'

export default function App() {
  const user = useStore((state) => state.user)
  const fetchUser = useStore((state) => state.fetchUser)
  const fetchAllUsers = useStore((state) => state.fetchAllUsers)
  const fetchPayments = useStore((state) => state.fetchPayments)
  const fetchContacts = useStore((state) => state.fetchContacts)
  const fetchLawyers = useStore((state) => state.fetchLawyer)

  useEffect(() => {
    fetchUser()
    fetchAllUsers()
    fetchContacts()
    fetchPayments()
    fetchLawyers()
  }, [])

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
      />
    </>
  )}