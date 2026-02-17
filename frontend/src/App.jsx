import { RouterProvider } from "react-router-dom"
import router from "./services/Routes"
import { ToastContainer } from 'react-toastify'
import './toast.css'
import { useStore } from "./zustand/store"
import { useEffect } from "react"

function App() {
  const {initApp, user , fetchHistory , fetchDrafts} = useStore()

  useEffect(() => {
    initApp()
  } ,[])

  useEffect(() => {
    fetchHistory()
    fetchDrafts()
  },[user])

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
  )
}

export default App
