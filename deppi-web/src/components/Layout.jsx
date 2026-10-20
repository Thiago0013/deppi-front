import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { ROUTES, ROLE_LABEL, ROLE_ORDER } from "../roles.js";

export default function Layout() {
  const { usuario, cargos, logout } = useAuth();
  const roles = ROLE_ORDER.filter((r) => cargos.includes(r));
  const initials = (usuario?.nome ?? "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">
          <span className="brand-mark" aria-hidden>D</span>
          <span>DEPPI</span>
        </div>

        <nav aria-label="Menu principal">
          {roles.map((role) => (
            <div key={role} className="nav-group">
              {roles.length > 1 && <p className="nav-title">{ROLE_LABEL[role]}</p>}
              {ROUTES.filter((r) => r.roles.includes(role)).map((r) => (
                <NavLink key={r.path} to={r.path} className="nav-link">
                  {r.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="me">
          <span className="avatar" aria-hidden>{initials}</span>
          <div className="me-text">
            <strong>{usuario?.nome}</strong>
            <small>{roles.map((r) => ROLE_LABEL[r]).join(", ")}</small>
          </div>
          <button className="btn btn-ghost" onClick={logout}>Sair</button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
