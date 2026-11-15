"use client";
// Tela 8: Resumo (/pastas/[id]/resumo)
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MenuAluno from "@/components/MenuAluno";
import { buscarPasta, listarMateriais, buscarResumo, gerarResumo, rotuloDoTipo } from "@/lib/dados-exemplo";
import s from "@/styles/telas-pasta.module.css";

const formatarData = (iso) => new Date(iso).toLocaleDateString("pt-BR");

export default function TelaResumo() {
  const { id } = useParams();
  const [carregando, setCarregando] = useState(true);
  const [pasta, setPasta] = useState(null);
  const [materiais, setMateriais] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [gerando, setGerando] = useState(false);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    let ativo = true;
    Promise.all([buscarPasta(id), listarMateriais(id), buscarResumo(id)]).then(([p, m, r]) => {
      if (!ativo) return;
      setPasta(p); setMateriais(m); setResumo(r); setCarregando(false);
    });
    return () => { ativo = false; };
  }, [id]);

  const mostrarAviso = (texto) => { setAviso(texto); setTimeout(() => setAviso(""), 2200); };

  async function gerar() {
    setGerando(true);
    setResumo(await gerarResumo(id));
    setGerando(false);
  }

  const paraRever = materiais.filter((m) => m.tipo !== "texto");
  const desatualizado = resumo && materiais.some((m) => m.atualizadoEm > resumo.atualizadoEm);

  async function copiar() {
    const partes = resumo.blocos.map((b) => `${b.titulo}\n${b.frase}`);
    const links = paraRever.map((m) => `${m.titulo}: ${m.endereco}`);
    const texto = [`Resumo de ${pasta.nome}`, ...partes, links.length ? `Para rever:\n${links.join("\n")}` : ""].filter(Boolean).join("\n\n");
    try { await navigator.clipboard.writeText(texto); mostrarAviso("Resumo copiado"); }
    catch { mostrarAviso("Não foi possível copiar"); }
  }

  return (
    <div className={s.pagina}>
      <MenuAluno />
      <main className={s.container}>
        {carregando && <div className={s.skeleton} style={{ height: 320 }} aria-busy="true" />}

        {!carregando && !pasta && (
          <div className={s.vazio}>
            <h2>Pasta não encontrada</h2>
            <p>Ela não existe ou pertence a outra pessoa.</p>
            <Link href="/pastas" className={`${s.btn} ${s.btnPrimario}`}>Ir para Minhas pastas</Link>
          </div>
        )}

        {!carregando && pasta && (
          <>
            <Link href={`/pastas/${id}`} className={`${s.voltar} nao-imprimir`}>← Voltar à pasta</Link>
            <div className={s.cabecalho}>
              <div>
                <h1 className={s.titulo}>Resumo de {pasta.nome}</h1>
                <p className={s.descricao}>{resumo ? `Atualizado em ${formatarData(resumo.atualizadoEm)}` : "Ainda não gerado"}</p>
              </div>
              {materiais.length > 0 && (
                <div className={`${s.acoes} nao-imprimir`}>
                  <button type="button" className={`${s.btn} ${s.btnPrimario}`} onClick={gerar} disabled={gerando}>
                    {gerando ? "Gerando..." : "Gerar resumo"}
                  </button>
                  {resumo && (
                    <>
                      <button type="button" className={`${s.btn} ${s.btnSecundario}`} onClick={copiar}>Copiar resumo</button>
                      <button type="button" className={`${s.btn} ${s.btnSecundario}`} onClick={() => window.print()}>Imprimir</button>
                    </>
                  )}
                </div>
              )}
            </div>

            {materiais.length === 0 ? (
              <div className={s.vazio}>
                <h2>Adicione materiais para gerar o resumo</h2>
                <p>O resumo junta o que você guardou na pasta.</p>
                <Link href={`/pastas/${id}/material/novo`} className={`${s.btn} ${s.btnPrimario}`}>Novo material</Link>
              </div>
            ) : (
              <>
                {desatualizado && <div className={`${s.aviso} nao-imprimir`} role="status">Há materiais novos. Gere de novo.</div>}

                {!resumo ? (
                  <div className={s.vazio}>
                    <h2>Seu resumo ainda não existe</h2>
                    <p>Clique em Gerar resumo para montar a folha de estudo.</p>
                  </div>
                ) : (
                  <>
                    <section className={s.folha} aria-label="Folha de estudo">
                      {resumo.blocos.length === 0 ? (
                        <p>Esta pasta não tem materiais de texto. Os links aparecem em Para rever.</p>
                      ) : resumo.blocos.map((b) => (
                        <div key={b.id} className={s.bloco}>
                          <span className={s.selo}>{rotuloDoTipo(b.tipo)}</span>
                          <h3>{b.titulo}</h3>
                          <p>{b.frase}</p>
                        </div>
                      ))}
                    </section>

                    {paraRever.length > 0 && (
                      <>
                        <h2 className={s.secaoTitulo}>Para rever</h2>
                        <div className={s.revisar}>
                          {paraRever.map((m) => (
                            <div key={m.id} className={s.revisarItem}>
                              <div><span className={s.selo}>{rotuloDoTipo(m.tipo)}</span>{m.titulo}</div>
                              <a href={m.endereco} target="_blank" rel="noopener noreferrer"
                                className={`${s.btn} ${s.btnSecundario} ${s.btnAbrir} nao-imprimir`}>Abrir</a>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </main>
      {aviso && <div className={`${s.toast} nao-imprimir`} role="status">{aviso}</div>}
    </div>
  );
}
