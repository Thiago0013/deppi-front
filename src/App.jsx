import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import { Forbidden, NotFound } from "./pages/Errors.jsx";
import { ROUTES, homeFor } from "./roles.js";

export default function App() {
  const { isAuth, cargos } = useAuth();
  const shell = isAuth ? <Layout /> : <Navigate to="/login" replace />;

  return (
    <Suspense fallback={<p className="center-msg">Carregando…</p>}>
      <Routes>
        <Route path="/login" element={isAuth ? <Navigate to={homeFor(cargos)} replace /> : <Login />} />
        <Route path="/" element={<Navigate to={isAuth ? homeFor(cargos) : "/login"} replace />} />

        {/* Cada rota só abre para os cargos declarados em roles.js */}
        <Route element={shell}>
          {ROUTES.map(({ path, roles, element: Page, label }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute roles={roles}>
                  <Page title={label} />
                </ProtectedRoute>
              }
            />
          ))}
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
