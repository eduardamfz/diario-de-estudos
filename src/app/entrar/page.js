"use client";

// TELA 2: Entrar ( /entrar )
// Formulário de login com e-mail e senha.
//
// IMPORTANTE: por enquanto o login é SIMULADO (aceita qualquer e-mail válido
// e qualquer senha). Na etapa do back-end, o bloco marcado com TODO será
// trocado pelo login de verdade no Back4App.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useAuth } from "@/store/useAuth";

export default function Entrar() {
  const router = useRouter();
  const entrar = useAuth((estado) => estado.entrar);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState({}); // erro de cada campo
  const [erroGeral, setErroGeral] = useState(""); // erro do login em si
  const [carregando, setCarregando] = useState(false);

  // Confere os campos antes de tentar entrar
  function validar() {
    const novosErros = {};

    if (!email.trim()) {
      novosErros.email = "Digite o seu e-mail.";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      novosErros.email = "Digite um e-mail válido.";
    }

    if (!senha) {
      novosErros.senha = "Digite a sua senha.";
    }

    return novosErros;
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErroGeral("");

    const novosErros = validar();
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return; // tem erro: para aqui

    setCarregando(true);
    try {
      // TODO (etapa do back-end): trocar este bloco pelo login no Back4App.
      await new Promise((resolver) => setTimeout(resolver, 700)); // finge que está pensando
      const nomeSimulado = email.split("@")[0];
      entrar({
        nome: nomeSimulado.charAt(0).toUpperCase() + nomeSimulado.slice(1),
        email: email.trim(),
      });

      router.push("/pastas");
    } catch (erro) {
      setErroGeral("E-mail ou senha incorretos. Tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="auth">
      <div className="auth-cartao">
        <div className="auth-topo">
          <Logo tamanho={56} />
          <h1>Bem-vindo de volta</h1>
          <p>Entre para ver as suas pastas de estudo.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {erroGeral && (
            <div className="alerta alerta-erro" role="alert">
              {erroGeral}
            </div>
          )}

          <div className={`campo ${erros.email ? "com-erro" : ""}`}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="voce@exemplo.com"
              autoComplete="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
            />
            {erros.email && <p className="campo-erro">{erros.email}</p>}
          </div>

          <div className={`campo ${erros.senha ? "com-erro" : ""}`}>
            <label htmlFor="senha">Senha</label>
            <div className="campo-senha">
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Sua senha"
                autoComplete="current-password"
                value={senha}
                onChange={(evento) => setSenha(evento.target.value)}
              />
              <button
                type="button"
                className="btn-mostrar"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {erros.senha && <p className="campo-erro">{erros.senha}</p>}
          </div>

          <div className="campo-linha">
            <Link href="/esqueci-senha" className="link">
              Esqueci minha senha
            </Link>
          </div>

          <button type="submit" className="btn btn-primario btn-grande btn-total" disabled={carregando}>
            {carregando ? (
              <>
                <span className="spinner" /> Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <p className="auth-rodape">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="link">
            Criar conta
          </Link>
        </p>
      </div>
    </section>
  );
}
