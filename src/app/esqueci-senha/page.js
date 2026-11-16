"use client";

// TELA 4: Esqueci minha senha ( /esqueci-senha )
// A pessoa digita o e-mail e recebe um link para criar uma senha nova.
//
// IMPORTANTE: por enquanto o envio é SIMULADO. Na etapa do back-end, o bloco
// marcado com TODO será trocado por Parse.User.requestPasswordReset(email).
//
// Por segurança, a mensagem de sucesso aparece mesmo se o e-mail não existir
// (assim ninguém descobre quem tem conta no site).
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);

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
    // TODO (etapa do back-end): trocar esta linha pelo envio de verdade no Back4App.
    await new Promise((resolver) => setTimeout(resolver, 700));
    setCarregando(false);
    setEnviado(true);
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
