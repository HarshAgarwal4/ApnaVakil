import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import LoginForm from "../pages/Login";
import { ProtectedRoute } from "./Authentication";

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute><Home/></ProtectedRoute>
    },
    {
        path: '/login',
        element: <LoginForm />
    }
])

export default router