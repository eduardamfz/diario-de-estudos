"use client";

// TELA 5: Minhas pastas ( /pastas )
// Lista as pastas da pessoa e permite criar, editar e excluir (CRUD).
//
// IMPORTANTE: por enquanto os dados vêm de src/lib/dados-exemplo.js.
// Na etapa do back-end, cada função de lá vira uma consulta do TanStack Query
// ligada ao Back4App.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MenuAluno from "@/components/MenuAluno";
import { Lapis, Lixeira } from "@/components/Icones";
import { useAuth } from "@/store/useAuth";
import { listarPastas, salvarPasta, excluirPasta, buscarDica, CORES } from "@/lib/dados-exemplo";
import s from "@/styles/pastas.module.css";

export default function MinhasPastas() {
  const usuario = useAuth((estado) => estado.usuario);

  const [carregando, setCarregando] = useState(true);
  const [pastas, setPastas] = useState([]);
  const [dica, setDica] = useState(null);
  const [busca, setBusca] = useState("");

  // janela de criar/editar: null = fechada, {} = nova, {id,...} = editando
  const [editando, setEditando] = useState(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cor, setCor] = useState(CORES[0]);
  const [erroNome, setErroNome] = useState("");
  const [salvando, setSalvando] = useState(false);

  // janela de excluir
  const [alvo, setAlvo] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const [aviso, setAviso] = useState("");

  async function carregar() {
    setPastas(await listarPastas());
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
    buscarDica().then(setDica);
  }, []);

  const visiveis = useMemo(
    () => pastas.filter((p) => p.nome.toLowerCase().includes(busca.trim().toLowerCase())),
    [pastas, busca]
  );

  function mostrarAviso(texto) {
    setAviso(texto);
    setTimeout(() => setAviso(""), 2200);
  }

  function abrirNova() {
    setEditando({});
    setNome("");
    setDescricao("");
    setCor(CORES[0]);
    setErroNome("");
  }

  function abrirEdicao(pasta) {
    setEditando(pasta);
    setNome(pasta.nome);
    setDescricao(pasta.descricao);
    setCor(pasta.cor);
    setErroNome("");
  }

  async function salvar(evento) {
    evento.preventDefault();
    if (!nome.trim()) {
      setErroNome("Dê um nome para a pasta.");
      return;
    }
    setSalvando(true);
    await salvarPasta({ id: editando.id, nome: nome.trim(), descricao: descricao.trim(), cor });
    await carregar();
    setSalvando(false);
    mostrarAviso(editando.id ? "Pasta atualizada" : "Pasta criada");
    setEditando(null);
  }

  async function confirmarExclusao() {
    setExcluindo(true);
    await excluirPasta(alvo.id);
    await carregar();
    setExcluindo(false);
    setAlvo(null);
    mostrarAviso("Pasta excluída");
  }

  return (
    <div className={s.pagina}>
      <MenuAluno />

      <div className={s.topo}>
        <div>
          <h1>Olá, {usuario ? usuario.nome : "estudante"}</h1>
          <p>
            {carregando
              ? "Carregando as suas pastas..."
              : `Você tem ${pastas.length} ${pastas.length === 1 ? "pasta" : "pastas"}.`}
          </p>
        </div>
        <button type="button" className="btn btn-primario" onClick={abrirNova}>
          + Nova pasta
        </button>
      </div>

      {dica && (
        <div className={s.dica}>
          <span className={s.dicaSelo}>Dica de estudo</span>
          <div>
            <strong>{dica.titulo}</strong>
            <span className="texto">{dica.texto}</span>
          </div>
        </div>
      )}

      {pastas.length > 0 && (
        <div className={s.barra}>
          <input
            className={s.busca}
            type="search"
            placeholder="Buscar pasta pelo nome"
            aria-label="Buscar pasta pelo nome"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>
      )}

      {carregando && (
        <div className={s.grade} aria-busy="true" aria-label="Carregando pastas">
          {[1, 2, 3].map((n) => (
            <div key={n} className={s.skeleton} />
          ))}
        </div>
      )}

      {!carregando && pastas.length === 0 && (
        <div className={s.vazio}>
          <h2>Crie a sua primeira pasta</h2>
          <p>Uma pasta para cada matéria: História, Biologia, Matemática...</p>
          <button type="button" className="btn btn-primario" onClick={abrirNova}>
            Criar pasta
          </button>
        </div>
      )}

      {!carregando && pastas.length > 0 && visiveis.length === 0 && (
        <div className={s.vazio}>
          <p style={{ marginBottom: 0 }}>Nenhuma pasta com esse nome.</p>
        </div>
      )}

      {!carregando && visiveis.length > 0 && (
        <div className={s.grade}>
          {visiveis.map((pasta) => (
            <article key={pasta.id} className={s.cartao} style={{ "--cor": pasta.cor }}>
              <Link href={`/pastas/${pasta.id}`} className={s.cartaoLink}>
                <h2>{pasta.nome}</h2>
                <p>{pasta.descricao || "Sem descrição"}</p>
                <span className={s.total}>
                  {pasta.totalMateriais} {pasta.totalMateriais === 1 ? "material" : "materiais"}
                </span>
              </Link>
              <div className={s.icones}>
                <button
                  type="button"
                  className={s.iconeBtn}
                  aria-label={`Editar ${pasta.nome}`}
                  onClick={() => abrirEdicao(pasta)}
                >
                  <Lapis />
                </button>
                <button
                  type="button"
                  className={`${s.iconeBtn} ${s.perigo}`}
                  aria-label={`Excluir ${pasta.nome}`}
                  onClick={() => setAlvo(pasta)}
                >
                  <Lixeira />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Janela: nova pasta / editar pasta */}
      {editando && (
        <div className={s.fundo} onClick={() => !salvando && setEditando(null)}>
          <form
            className={s.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-pasta"
            onClick={(evento) => evento.stopPropagation()}
            onSubmit={salvar}
            noValidate
          >
            <h2 id="titulo-pasta">{editando.id ? "Editar pasta" : "Nova pasta"}</h2>
            <p>Escolha um nome e uma cor para reconhecer a pasta rápido.</p>

            <div className={`campo ${erroNome ? "com-erro" : ""}`}>
              <label htmlFor="nome-pasta">Nome</label>
              <input
                id="nome-pasta"
                type="text"
                placeholder="Ex.: História"
                value={nome}
                autoFocus
                onChange={(evento) => setNome(evento.target.value)}
              />
              {erroNome && <p className="campo-erro">{erroNome}</p>}
            </div>

            <div className="campo">
              <label htmlFor="descricao-pasta">Descrição (opcional)</label>
              <textarea
                id="descricao-pasta"
                placeholder="Sobre o que é esta pasta?"
                value={descricao}
                onChange={(evento) => setDescricao(evento.target.value)}
              />
            </div>

            <div className="campo">
              <span className={s.rotulo}>Cor</span>
              <div className={s.cores} role="group" aria-label="Cor da pasta">
                {CORES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Cor ${c}`}
                    aria-pressed={cor === c}
                    className={`${s.cor} ${cor === c ? s.corAtiva : ""}`}
                    style={{ background: c }}
                    onClick={() => setCor(c)}
                  />
                ))}
              </div>
            </div>

            <div className={s.acoes}>
              <button type="button" className="btn btn-contorno" onClick={() => setEditando(null)} disabled={salvando}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primario" disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Janela: confirmar exclusão */}
      {alvo && (
        <div className={s.fundo} onClick={() => !excluindo && setAlvo(null)}>
          <div
            className={s.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-excluir"
            onClick={(evento) => evento.stopPropagation()}
          >
            <h2 id="titulo-excluir">Excluir a pasta e os materiais dela?</h2>
            <p>
              “{alvo.nome}” e tudo o que está dentro dela serão removidos. Não dá para desfazer.
            </p>
            <div className={s.acoes}>
              <button type="button" className="btn btn-contorno" onClick={() => setAlvo(null)} disabled={excluindo}>
                Cancelar
              </button>
              <button type="button" className={`btn ${s.btnPerigo}`} onClick={confirmarExclusao} disabled={excluindo}>
                {excluindo ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {aviso && (
        <div className={s.toast} role="status">
          {aviso}
        </div>
      )}
    </div>
  );
}
