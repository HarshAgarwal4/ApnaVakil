import { useNavigate } from "react-router-dom"
import { useStore } from "../zustand/store"
import LoadingPage from "../pages/Loading"
import { useEffect } from "react"
import Unauthorized from "../pages/Unauth"

const ProtectedRoute = ({children}) => {
    const user = useStore((state) => state.user)
    const loading = useStore((state) => state.loading)
    const role = useStore((state) => state.role)
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [loading, user]);

    if (loading) return <LoadingPage />;

    if (user && role != 'admin') {
        return <Unauthorized />
    }
    if (user && role == 'admin') {
        return children;
    }

    return null;
}

export {ProtectedRoute}