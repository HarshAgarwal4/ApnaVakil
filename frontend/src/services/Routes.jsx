import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import SignupForm from "../pages/SignUpPage";
import LoginForm from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ForgotPassword from "../pages/FgtPwd";
import ProtectedRoute from "./Authentication";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/signup' ,
        element: <SignupForm />
    },
    {
        path: '/login',
        element: <LoginForm />
    },
    {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
    },
    {
        path: '/forget-password',
        element: <ForgotPassword />
    }
])

export default router