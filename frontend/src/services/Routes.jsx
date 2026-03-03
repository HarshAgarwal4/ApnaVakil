import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import SignupForm from "../pages/SignUpPage";
import LoginForm from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ForgotPassword from "../pages/FgtPwd";
import ProtectedRoute from "./Authentication";
import { PaymentProtected } from "./PaidPage";
import LawyersPage from "../pages/Lawyers";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/signup',
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
    },
    {
        path: '/lawyers',
        element: <ProtectedRoute>
            <PaymentProtected>
                <LawyersPage />
            </PaymentProtected>

        </ProtectedRoute>
    }
])

export default router