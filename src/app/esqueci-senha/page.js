"use client";

// TELA 4: Esqueci minha senha ( /esqueci-senha )
// A pessoa digita o e-mail e recebe um link para criar uma senha nova.
//
// O Supabase envia o e-mail (função pedirNovaSenha, em src/lib/api.js).
//
// Por segurança, a mensagem de sucesso aparece mesmo se o e-mail não existir
// (assim ninguém descobre quem tem conta no site).
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { usePedirNovaSenha } from "@/lib/hooks";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const pedirMutation = usePedirNovaSenha();

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");

    if (!email.trim()) {
      setErro("Digite o seu e-mail.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErro("Digite um e-mail válido.");
      return;
    }

    setCarregando(true);
    try {
      await pedirMutation.mutateAsync(email.trim()); // o Supabase envia o e-mail
      setEnviado(true);
    } catch (erro) {
      // Se o e-mail não existe, o Supabase não dá erro: mostramos sucesso do mesmo jeito.
      if (erro.codigo === "limite") setErro("Muitos pedidos seguidos. Espere um pouco e tente de novo.");
      else setErro(`Não foi possível enviar agora. Motivo: ${erro.detalhe || erro.message}`);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="auth">
      <div className="auth-cartao">
        <div className="auth-topo">
          <Logo tamanho={56} />
          <h1>Esqueceu a senha?</h1>
          <p>Digite o seu e-mail e enviaremos um link para criar uma nova.</p>
        </div>

        {enviado && (
          <div
            className="alerta"
            role="status"
            style={{ color: "#166534", background: "#f0fdf4", border: "1px solid #bbf7d0" }}
          >
            Enviamos um link para o seu e-mail. Confira também a caixa de spam.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`campo ${erro ? "com-erro" : ""}`}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="voce@exemplo.com"
              autoComplete="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
            />
            {erro && <p className="campo-erro">{erro}</p>}
          </div>

          <button type="submit" className="btn btn-primario btn-grande btn-total" disabled={carregando}>
            {carregando ? (
              <>
                <span className="spinner" /> Enviando...
              </>
            ) : enviado ? (
              "Enviar de novo"
            ) : (
              "Enviar link"
            )}
          </button>
        </form>

        <p className="auth-rodape">
          Lembrou da senha?{" "}
          <Link href="/entrar" className="link">
            Voltar para Entrar
          </Link>
        </p>
      </div>
    </section>
  );
}
