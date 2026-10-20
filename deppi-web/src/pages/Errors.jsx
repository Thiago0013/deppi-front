import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { homeFor } from "../roles.js";

function Page({ code, title, text }) {
  const { cargos } = useAuth();
  return (
    <div className="card error-page">
      <span className="error-code">{code}</span>
      <h1>{title}</h1>
      <p className="muted">{text}</p>
      <Link className="btn" to={homeFor(cargos)}>Voltar ao início</Link>
    </div>
  );
}

export const Forbidden = () => (
  <Page code="403" title="Você não tem permissão para ver esta página" text="Seu cargo não dá acesso a esta área. Se isso for um engano, fale com a equipe do DEPPI." />
);

export const NotFound = () => (
  <Page code="404" title="Página não encontrada" text="O endereço digitado não existe." />
);
