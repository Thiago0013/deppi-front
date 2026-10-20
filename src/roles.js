import { lazy } from "react";

// Ordem de prioridade para escolher a "página inicial" de quem tem vários cargos
export const ROLE_ORDER = ["ADMIN", "DEPPI", "PROFESSOR", "ALUNO"];

export const ROLE_LABEL = {
  ADMIN: "Administrador",
  DEPPI: "Equipe DEPPI",
  PROFESSOR: "Professor",
  ALUNO: "Aluno",
};

const AdminHome = lazy(() => import("./pages/AdminHome.jsx"));
const Placeholder = lazy(() => import("./pages/Placeholder.jsx"));

/**
 * Fonte única da verdade: cada rota declara quais cargos podem acessar.
 * O menu e a proteção de rotas usam esta mesma lista, então
 * "o que aparece no menu" == "o que o cargo pode acessar".
 */
export const ROUTES = [
  { path: "/admin", label: "Início", roles: ["ADMIN"], element: AdminHome },
  { path: "/deppi", label: "Início", roles: ["DEPPI"], element: Placeholder },
  { path: "/professor", label: "Início", roles: ["PROFESSOR"], element: Placeholder },
  { path: "/aluno", label: "Início", roles: ["ALUNO"], element: Placeholder },
];

export const homeFor = (cargos = []) => {
  const role = ROLE_ORDER.find((r) => cargos.includes(r));
  return ROUTES.find((r) => r.roles.includes(role))?.path ?? "/login";
};
