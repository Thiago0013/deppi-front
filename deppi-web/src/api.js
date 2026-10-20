// Em dev usa o proxy do Vite (/api); em produção usa a URL do Render.
const BASE = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL || "https://deppi-api-3i98.onrender.com";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = "GET", body, token, auth = true } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Não foi possível falar com o servidor. Tente novamente.", 0);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // token vencido/ inválido em rota protegida → avisa o AuthContext
    if (res.status === 401 && auth) window.dispatchEvent(new Event("deppi:unauthorized"));
    throw new ApiError(data.mensagem || data.error || "Algo deu errado.", res.status);
  }
  return data;
}
