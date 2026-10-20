# DEPPI-WEB · Entrega 1

Login/logout, controle de acesso por cargo e tela **Início** do ADMIN.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # gera /dist
```

- Em dev, `/api/*` é encaminhado (proxy do Vite) para https://deppi-api-3i98.onrender.com — evita CORS.
- Em produção, a URL vem de `VITE_API_URL` (padrão: a URL do Render). **A API precisa habilitar CORS** (`npm i cors` + `app.use(cors())` em `src/app.ts`).
- Permissões: tudo em `src/roles.js` (rotas + cargos). Menu e proteção usam a mesma lista.
- Admin de teste (seed): `admin@deppi.local`.
