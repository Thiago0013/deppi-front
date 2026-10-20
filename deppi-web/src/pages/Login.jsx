import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { homeFor } from "../roles.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from;
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const { usuario } = await login(email.trim(), senha);
      navigate(from ?? homeFor(usuario.cargos), { replace: true });
    } catch (err) {
      setErro(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <section className="login-board" aria-hidden>
        <p className="board-title">Cada pessoa, um caminho de aprendizagem.</p>
        <svg viewBox="0 0 320 120" className="board-art">
          <rect x="8" y="70" width="304" height="26" rx="3" fill="#FFD84D" />
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={i} x1={28 + i * 20} y1="70" x2={28 + i * 20} y2={i % 5 === 0 ? 90 : 82} stroke="#1B2B5B" strokeWidth="2" />
          ))}
          <path d="M40 54 L200 18 L212 30 L52 66 Z" fill="#fff" />
          <path d="M200 18 L222 12 L226 24 L212 30 Z" fill="#FF8FA3" />
        </svg>
      </section>

      <section className="login-form-wrap">
        <form className="card login-form" onSubmit={onSubmit}>
          <h1>Entrar no DEPPI</h1>
          <p className="muted">Use o e-mail institucional e a senha da sua conta.</p>

          <label>
            E-mail institucional
            <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Senha
            <input type="password" required autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </label>

          {erro && <p className="alert" role="alert">{erro}</p>}

          <button className="btn" disabled={loading}>{loading ? "Entrando…" : "Entrar"}</button>
          {loading && <p className="muted small">O servidor gratuito pode levar alguns segundos para acordar.</p>}
        </form>
      </section>
    </div>
  );
}
