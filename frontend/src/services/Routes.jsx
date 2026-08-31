import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import SignupForm from "../pages/SignUpPage";
import LoginForm from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ForgotPassword from "../pages/FgtPwd";
import ProtectedRoute from "./Authentication";
import { PaymentProtected } from "./PaidPage";
import LawyersPage from "../pages/Lawyers";
import LawyerDashboard from "../LawyerPanel/LawyerDashboard";
import LawyerProfile from "../pages/LawyerProfile";
import Disclaimer from "../pages/Disclaimer";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsOfService";

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
    },
    {
        path: '/lawyer/:id',
        element: <ProtectedRoute>
            <LawyerProfile />
        </ProtectedRoute>
    },
    {
        path: '/lawyer/dashboard',
        element: <ProtectedRoute>
            <LawyerDashboard />
        </ProtectedRoute>
    },
    {
        path: '/lawyer-panel',
        element: <ProtectedRoute>
            <LawyerDashboard />
        </ProtectedRoute>
    },
    {
        path: '/disclaimer',
        element: <Disclaimer />
    },
    {
        path: '/privacy-policy',
        element: <PrivacyPolicy />
    },
    {
        path: '/terms-and-conditions',
        element: <TermsAndConditions />
    }
]);

export default router;