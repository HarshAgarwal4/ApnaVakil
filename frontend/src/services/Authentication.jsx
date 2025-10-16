import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/GlobalContext";
import LoadingPage from "../components/Loading";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Redirect to /login only when loading is done AND user is null
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // 🔁 Still show loading page while checking
  if (loading) return <LoadingPage />;

  // ✅ If user exists, allow access
  if (user) {
    return children;
  }

  // 🚪 If user is null and not loading (just in case navigate hasn't triggered yet)
  return null;
};

export default ProtectedRoute;
