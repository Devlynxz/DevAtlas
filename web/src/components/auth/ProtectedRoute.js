import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../ui/Spinner";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [loading, isAuthenticated, navigate, location]);

  if (loading || !isAuthenticated) return <Spinner />;

  return children;
}
