import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

const CARGOS = ["ALUNO", "PROFESSOR", "DEPPI", "ADMIN"];

const INSC = [
  { key: "PENDENTE", label: "Pendentes", color: "#F2A900" },
  { key: "DEFERIDO", label: "Deferidas", color: "#2E9E6B" },
  { key: "INDEFERIDO", label: "Indeferidas", color: "#D9534F" },
  { key: "CANCELADO", label: "Canceladas", color: "#7A8299" },
];
const CURSOS = [
  { key: "ANDAMENTO", label: "Em andamento", color: "#2F6FED" },
  { key: "ANALISE", label: "Em análise", color: "#F2A900" },
  { key: "CONCLUIDO", label: "Concluídos", color: "#2E9E6B" },
  { key: "FECHADO", label: "Fechados", color: "#7A8299" },
];

const n = (v) => (v ?? 0).toLocaleString("pt-BR");

function Stat({ label, value, hint, tone }) {
  return (
    <div className={`card stat tone-${tone}`}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {hint && <small className="muted">{hint}</small>}
    </div>
  );
}

function Bars({ items, data }) {
  const max = Math.max(1, ...items.map((i) => data?.[i.key] ?? 0));
  return (
    <ul className="bars">
      {items.map((i) => {
        const v = data?.[i.key] ?? 0;
        return (
          <li key={i.key}>
            <span className="bar-label">{i.label}</span>
            <span className="bar-track">
              <span className="bar-fill" style={{ width: `${(v / max) * 100}%`, background: i.color }} />
            </span>
            <strong>{n(v)}</strong>
          </li>
        );
      })}
    </ul>
  );
}

function Donut({ items, data, total }) {
  const R = 52, C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 140 140" className="donut" role="img" aria-label="Cursos por situação">
        <circle cx="70" cy="70" r={R} fill="none" stroke="#E6EAF4" strokeWidth="22" />
        {total > 0 && items.map((i) => {
          const len = ((data?.[i.key] ?? 0) / total) * C;
          const el = (
            <circle key={i.key} cx="70" cy="70" r={R} fill="none" stroke={i.color} strokeWidth="22"
              strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} transform="rotate(-90 70 70)" />
          );
          offset += len;
          return el;
        })}
        <text x="70" y="68" textAnchor="middle" className="donut-n">{n(total)}</text>
        <text x="70" y="86" textAnchor="middle" className="donut-t">cursos</text>
      </svg>
      <ul className="legend">
        {items.map((i) => (
          <li key={i.key}><span className="dot" style={{ background: i.color }} />{i.label}<strong>{n(data?.[i.key])}</strong></li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminHome() {
  const { token, usuario } = useAuth();
  const [cargos, setCargos] = useState([]);
  const [data, setData] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const qs = cargos.map((c) => `cargos=${c}`).join("&");
      setData(await api(`/admin/dashboard/summary${qs ? `?${qs}` : ""}`, { token }));
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }, [token, cargos]);

  useEffect(() => { carregar(); }, [carregar]);

  const toggle = (c) => setCargos((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  const v = data?.cursos?.vagas;
  const pctVagas = v?.totalOfertadas ? Math.min(100, (v.totalInscritosDeferidos / v.totalOfertadas) * 100) : 0;

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="page-title">Início</h1>
          <p className="muted">Olá, {usuario?.nome?.split(" ")[0]}! Este é o resumo de como o DEPPI está hoje.</p>
        </div>
        <button className="btn btn-ghost" onClick={carregar} disabled={loading}>{loading ? "Atualizando…" : "Atualizar"}</button>
      </header>

      {erro && <p className="alert" role="alert">{erro}</p>}
      {!data && loading && <p className="muted">Carregando os números… (o servidor pode demorar a acordar)</p>}

      {data && (
        <div className={loading ? "dim" : ""}>
          <section className="stats">
            <Stat tone="blue" label="Usuários" value={n(data.usuarios.total)}
              hint={data.usuarios.filtroCargos !== undefined ? `${n(data.usuarios.filtroCargos)} no filtro` : "no sistema"} />
            <Stat tone="green" label="Instituições" value={n(data.instituicoes.total)} hint="cadastradas" />
            <Stat tone="yellow" label="Cursos" value={n(data.cursos.total)} hint="ofertados" />
            <Stat tone="pink" label="Inscrições" value={n(data.inscricoes.total)} hint="recebidas" />
          </section>

          <section className="card filter">
            <span>Contar usuários por cargo:</span>
            {CARGOS.map((c) => (
              <button key={c} type="button" className={`chip ${cargos.includes(c) ? "on" : ""}`} aria-pressed={cargos.includes(c)} onClick={() => toggle(c)}>
                {c[0] + c.slice(1).toLowerCase()}
              </button>
            ))}
          </section>

          <section className="grid2">
            <div className="card">
              <h2>Inscrições por situação</h2>
              <Bars items={INSC} data={data.inscricoes.porStatus} />
            </div>
            <div className="card">
              <h2>Cursos por situação</h2>
              <Donut items={CURSOS} data={data.cursos.porStatus} total={data.cursos.total} />
            </div>
          </section>

          <section className="card">
            <h2>Vagas</h2>
            <div className="meter" role="img" aria-label={`${pctVagas.toFixed(0)}% das vagas preenchidas`}>
              <span style={{ width: `${pctVagas}%` }} />
            </div>
            <div className="vagas">
              <div><strong>{n(v.totalOfertadas)}</strong><small>ofertadas</small></div>
              <div><strong>{n(v.totalInscritosDeferidos)}</strong><small>preenchidas (deferidas)</small></div>
              <div><strong>{n(v.vagasRestantes)}</strong><small>restantes</small></div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
