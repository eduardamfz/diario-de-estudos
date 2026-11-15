"use client";
// Tela 7: formulário único para criar e editar material.
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MenuAluno from "@/components/MenuAluno";
import { buscarPasta, buscarMaterial, salvarMaterial, TIPOS } from "@/lib/dados-exemplo";
import s from "@/styles/telas-pasta.module.css";

export default function FormularioMaterial({ pastaId, materialId }) {
  const router = useRouter();
  const editando = Boolean(materialId);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [tipo, setTipo] = useState("texto");
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [endereco, setEndereco] = useState("");
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    let ativo = true;
    (async () => {
      const pasta = await buscarPasta(pastaId);
      const mat = editando ? await buscarMaterial(materialId) : null;
      if (!ativo) return;
      if (!pasta || (editando && (!mat || mat.pastaId !== pastaId))) setNaoEncontrado(true);
      else if (mat) { setTipo(mat.tipo); setTitulo(mat.titulo); setConteudo(mat.conteudo); setEndereco(mat.endereco); }
      setCarregando(false);
    })();
    return () => { ativo = false; };
  }, [pastaId, materialId, editando]);

  const precisaLink = tipo !== "texto";

  function validar() {
    const e = {};
    if (!titulo.trim()) e.titulo = "Escreva um título.";
    if (!precisaLink && !conteudo.trim()) e.conteudo = "Escreva ou cole o conteúdo.";
    if (precisaLink && !/^https?:\/\//i.test(endereco.trim())) e.endereco = "Cole um endereço que comece com http.";
    return e;
  }

  async function enviar(ev) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length) return;
    setSalvando(true);
    await salvarMaterial({
      id: editando ? materialId : undefined, pastaId, tipo,
      titulo: titulo.trim(), conteudo: conteudo.trim(), endereco: precisaLink ? endereco.trim() : "",
    });
    setSalvo(true);
    setTimeout(() => router.push(`/pastas/${pastaId}`), 900);
  }

  const voltar = `/pastas/${pastaId}`;

  return (
    <div className={s.pagina}>
      <MenuAluno />
      <main className={`${s.container} ${s.estreito}`}>
        {carregando ? (
          <div className={s.skeleton} style={{ height: 420 }} aria-busy="true" />
        ) : naoEncontrado ? (
          <div className={s.vazio}>
            <h2>Não encontramos isso</h2>
            <p>A pasta ou o material não existe, ou é de outra pessoa.</p>
            <Link href="/pastas" className={`${s.btn} ${s.btnPrimario}`}>Ir para Minhas pastas</Link>
          </div>
        ) : (
          <>
            <Link href={voltar} className={s.voltar}>← Voltar à pasta</Link>
            <h1 className={s.titulo} style={{ marginBottom: 20 }}>{editando ? "Editar material" : "Novo material"}</h1>

            <form className={s.formCartao} onSubmit={enviar} noValidate>
              <div className={s.campo} role="group" aria-labelledby="rotulo-tipo">
                <span id="rotulo-tipo" className={s.rotulo}>Tipo</span>
                <div className={s.tipos}>
                  {TIPOS.map((t) => (
                    <button key={t.valor} type="button" aria-pressed={tipo === t.valor}
                      className={`${s.tipoBtn} ${tipo === t.valor ? s.tipoAtivo : ""}`}
                      onClick={() => { setTipo(t.valor); setErros({}); }}>{t.rotulo}</button>
                  ))}
                </div>
              </div>

              <div className={s.campo}>
                <label htmlFor="titulo" className={s.rotulo}>Título do material</label>
                <input id="titulo" className={`${s.input} ${erros.titulo ? s.inputErro : ""}`} value={titulo}
                  onChange={(e) => setTitulo(e.target.value)} placeholder="Revolução Francesa: causas"
                  aria-invalid={Boolean(erros.titulo)} />
                {erros.titulo && <p className={s.msgErro}>{erros.titulo}</p>}
              </div>

              <div className={s.campo}>
                <label htmlFor="conteudo" className={s.rotulo}>Conteúdo</label>
                <textarea id="conteudo" className={`${s.input} ${s.areaTexto} ${erros.conteudo ? s.inputErro : ""}`} value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  placeholder={precisaLink ? "Anotações sobre este material (opcional)" : "Escreva ou cole o que o professor passou"}
                  aria-invalid={Boolean(erros.conteudo)} />
                {erros.conteudo && <p className={s.msgErro}>{erros.conteudo}</p>}
              </div>

              {precisaLink && (
                <div className={s.campo}>
                  <label htmlFor="endereco" className={s.rotulo}>Endereço (link)</label>
                  <input id="endereco" type="url" className={`${s.input} ${erros.endereco ? s.inputErro : ""}`} value={endereco}
                    onChange={(e) => setEndereco(e.target.value)} placeholder="https://"
                    aria-invalid={Boolean(erros.endereco)} />
                  {erros.endereco && <p className={s.msgErro}>{erros.endereco}</p>}
                </div>
              )}

              <div className={s.formAcoes}>
                <button type="submit" className={`${s.btn} ${s.btnPrimario}`} disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</button>
                <Link href={voltar} className={`${s.btn} ${s.btnSecundario}`}>Cancelar</Link>
              </div>
            </form>
          </>
        )}
      </main>
      {salvo && <div className={s.toast} role="status">Material salvo</div>}
    </div>
  );
}
