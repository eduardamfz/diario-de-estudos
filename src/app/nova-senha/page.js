"use client";

// TELA 4B: Nova senha ( /nova-senha )
// A pessoa chega aqui pelo link do e-mail de "Esqueci minha senha".
// O Supabase já deixa a pessoa "logada" por esse link, então só falta escolher a senha nova.
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useAuth } from "@/store/useAuth";
import { useTrocarSenha } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";

export default function NovaSenha() {
  const router = useRouter();
  const entrar = useAuth((estado) => estado.entrar);
  const trocarMutation = useTrocarSenha();

  const [verificado, setVerificado] = useState(false); // já conferimos o link?
  const [temSessao, setTemSessao] = useState(false); // o link é válido?
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Confere se a pessoa chegou por um link válido do e-mail
  useEffect(() => {
    if (!supabase) {
      setVerificado(true);
      return;
    }
    const { data } = supabase.auth.onAuthStateChange((evento, sessao) => {
      if (sessao) setTemSessao(true);
    });
    supabase.auth.getSession().then(({ data: resposta }) => {
      setTemSessao(Boolean(resposta.session));
      setVerificado(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErroGeral("");

    const novosErros = {};
    if (!senha) novosErros.senha = "Crie uma senha.";
    else if (senha.length < 6) novosErros.senha = "A senha precisa ter pelo menos 6 caracteres.";
    if (!confirmar) novosErros.confirmar = "Repita a senha.";
    else if (confirmar !== senha) novosErros.confirmar = "As senhas não são iguais.";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setCarregando(true);
    try {
      const usuario = await trocarMutation.mutateAsync(senha);
      entrar(usuario);
      router.push("/pastas");
    } catch (erro) {
      setErroGeral("Não foi possível trocar a senha. Peça um novo link e tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="auth">
      <div className="auth-cartao">
        <div className="auth-topo">
          <Logo tamanho={56} />
          <h1>Crie uma senha nova</h1>
          <p>Escolha a nova senha para entrar na sua conta.</p>
        </div>

        {!verificado && <p style={{ textAlign: "center" }}>Conferindo o link...</p>}

        {verificado && !temSessao && (
          <>
            <div className="alerta alerta-erro" role="alert">
              Este link não é válido ou já expirou.
            </div>
            <p className="auth-rodape">
              <Link href="/esqueci-senha" className="link">
                Pedir um link novo
              </Link>
            </p>
          </>
        )}

        {verificado && temSessao && (
          <form onSubmit={handleSubmit} noValidate>
            {erroGeral && (
              <div className="alerta alerta-erro" role="alert">
                {erroGeral}
              </div>
            )}

            <div className={`campo ${erros.senha ? "com-erro" : ""}`}>
              <label htmlFor="senha">Nova senha</label>
              <div className="campo-senha">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Mínimo de 6 caracteres"
                  autoComplete="new-password"
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                />
                <button type="button" className="btn-mostrar" onClick={() => setMostrarSenha(!mostrarSenha)}>
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {erros.senha && <p className="campo-erro">{erros.senha}</p>}
            </div>

            <div className={`campo ${erros.confirmar ? "com-erro" : ""}`}>
              <label htmlFor="confirmar">Confirmar senha</label>
              <input
                id="confirmar"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Repita a senha"
                autoComplete="new-password"
                value={confirmar}
                onChange={(evento) => setConfirmar(evento.target.value)}
              />
              {erros.confirmar && <p className="campo-erro">{erros.confirmar}</p>}
            </div>

            <button type="submit" className="btn btn-primario btn-grande btn-total" disabled={carregando}>
              {carregando ? (
                <>
                  <span className="spinner" /> Salvando...
                </>
              ) : (
                "Salvar nova senha"
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
