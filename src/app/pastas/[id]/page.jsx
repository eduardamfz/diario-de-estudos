"use client";
// Tela 6: Pasta (/pastas/[id])
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MenuAluno from "@/components/MenuAluno";
import { Lapis, Lixeira } from "@/components/Icones";
import { usePasta, useMateriais, useExcluirMaterial } from "@/lib/hooks";
import { TIPOS, rotuloDoTipo } from "@/lib/constantes";
import s from "@/styles/telas-pasta.module.css";

const formatarData = (iso) => new Date(iso).toLocaleDateString("pt-BR");

export default function TelaPasta() {
  const { id } = useParams();
  // Dados vêm do Supabase pelo TanStack Query
  const pastaQuery = usePasta(id);
  const materiaisQuery = useMateriais(id);
  const excluirMutation = useExcluirMaterial();
  const pasta = pastaQuery.data;
  const materiais = materiaisQuery.data ?? [];
  const carregando = pastaQuery.isLoading || materiaisQuery.isLoading;
  const [filtro, setFiltro] = useState("todos");
  const [abertos, setAbertos] = useState([]); // textos abertos por inteiro
  const [alvo, setAlvo] = useState(null); // material a excluir
  const excluindo = excluirMutation.isPending;

  const visiveis = filtro === "todos" ? materiais : materiais.filter((m) => m.tipo === filtro);
  const alternar = (mid) => setAbertos((a) => (a.includes(mid) ? a.filter((x) => x !== mid) : [...a, mid]));

  async function confirmarExclusao() {
    await excluirMutation.mutateAsync(alvo.id);
    setAlvo(null);
  }

  return (
    <div className={s.pagina}>
      <MenuAluno />
      <main className={s.container}>
        {carregando && (
          <div className={s.grade} aria-busy="true" aria-label="Carregando materiais">
            {[1, 2, 3].map((n) => <div key={n} className={s.skeleton} />)}
          </div>
        )}

        {!carregando && !pasta && (
          <div className={s.vazio}>
            <h2>Pasta não encontrada</h2>
            <p>Ela não existe ou pertence a outra pessoa.</p>
            <Link href="/pastas" className={`${s.btn} ${s.btnPrimario}`}>Ir para Minhas pastas</Link>
          </div>
        )}

        {!carregando && pasta && (
          <>
            <Link href="/pastas" className={s.voltar}>← Minhas pastas</Link>
            <div className={s.cabecalho}>
              <div>
                <h1 className={s.titulo}><span className={s.faixaCor} style={{ background: pasta.cor }} />{pasta.nome}</h1>
                <p className={s.descricao}>{pasta.descricao}</p>
              </div>
              <div className={s.acoes}>
                <Link href={`/pastas/${id}/material/novo`} className={`${s.btn} ${s.btnPrimario}`}>Novo material</Link>
                <Link href={`/pastas/${id}/resumo`} className={`${s.btn} ${s.btnSecundario}`}>Ver resumo</Link>
              </div>
            </div>

            {materiais.length === 0 ? (
              <div className={s.vazio}>
                <h2>Nada por aqui ainda</h2>
                <p>Guarde sua primeira anotação.</p>
                <Link href={`/pastas/${id}/material/novo`} className={`${s.btn} ${s.btnPrimario}`}>Novo material</Link>
              </div>
            ) : (
              <>
                <div className={s.filtros} role="group" aria-label="Filtrar por tipo">
                  {[{ valor: "todos", rotulo: "Todos" }, ...TIPOS].map((t) => (
                    <button key={t.valor} type="button" aria-pressed={filtro === t.valor}
                      className={`${s.filtro} ${filtro === t.valor ? s.filtroAtivo : ""}`}
                      onClick={() => setFiltro(t.valor)}>{t.rotulo}</button>
                  ))}
                </div>

                {visiveis.length === 0 ? (
                  <div className={s.vazio}><p>Nenhum material desse tipo nesta pasta.</p></div>
                ) : (
                  <div className={s.grade}>
                    {visiveis.map((m) => {
                      const ehTexto = m.tipo === "texto";
                      const aberto = abertos.includes(m.id);
                      return (
                        <article key={m.id}
                          className={`${s.cartao} ${ehTexto ? s.cartaoClicavel : ""}`}
                          {...(ehTexto ? {
                            role: "button", tabIndex: 0, "aria-expanded": aberto,
                            onClick: () => alternar(m.id),
                            onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); alternar(m.id); } },
                          } : {})}>
                          <div className={s.cartaoTopo}>
                            <span className={s.selo}>{rotuloDoTipo(m.tipo)}</span>
                            <div className={s.icones} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                              <Link href={`/pastas/${id}/material/${m.id}`} className={s.iconeBtn} aria-label={`Editar ${m.titulo}`}><Lapis /></Link>
                              <button type="button" className={`${s.iconeBtn} ${s.iconeBtnPerigo}`} aria-label={`Excluir ${m.titulo}`} onClick={() => setAlvo(m)}><Lixeira /></button>
                            </div>
                          </div>
                          <h2 className={s.cartaoTitulo}>{m.titulo}</h2>
                          <p className={`${s.cartaoTexto} ${aberto ? s.cartaoAberto : ""}`}>{m.conteudo}</p>
                          <div className={s.cartaoRodape}>
                            <span className={s.data}>{formatarData(m.atualizadoEm)}</span>
                            {!ehTexto && (
                              <a href={m.endereco} target="_blank" rel="noopener noreferrer"
                                className={`${s.btn} ${s.btnSecundario} ${s.btnAbrir}`}>Abrir</a>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {alvo && (
        <div className={s.modalFundo} onClick={() => !excluindo && setAlvo(null)}>
          <div className={s.modal} role="dialog" aria-modal="true" aria-labelledby="titulo-excluir" onClick={(e) => e.stopPropagation()}>
            <h2 id="titulo-excluir">Excluir este material?</h2>
            <p>“{alvo.titulo}” será removido da pasta. Não dá para desfazer.</p>
            <div className={s.modalAcoes}>
              <button type="button" className={`${s.btn} ${s.btnSecundario}`} onClick={() => setAlvo(null)} disabled={excluindo}>Cancelar</button>
              <button type="button" className={`${s.btn} ${s.btnPerigo}`} onClick={confirmarExclusao} disabled={excluindo}>{excluindo ? "Excluindo..." : "Excluir"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
