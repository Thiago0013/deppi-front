import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

// Sem login → /login. Logado, mas sem o cargo → /403.
export default function ProtectedRoute({ roles, children }) {
  const { isAuth, cargos } = useAuth();
  const location = useLocation();

  if (!isAuth) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!roles.some((r) => cargos.includes(r))) return <Navigate to="/403" replace />;
  return children;
}
