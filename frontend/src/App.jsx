import { RouterProvider } from "react-router-dom"
import router from "./services/Routes"
import { ToastContainer } from 'react-toastify'
import './toast.css'

function App() {

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
