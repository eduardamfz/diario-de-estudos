"use client";

// TELA 3: Criar conta ( /cadastro )
// Nome, e-mail, senha e confirmação de senha.
//
// IMPORTANTE: por enquanto o cadastro é SIMULADO. Na etapa do back-end, o bloco
// marcado com TODO será trocado pela criação de usuário no Back4App.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useAuth } from "@/store/useAuth";

export default function Cadastro() {
  const router = useRouter();
  const entrar = useAuth((estado) => estado.entrar);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [carregando, setCarregando] = useState(false);

  function validar() {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = "Digite o seu nome.";

    if (!email.trim()) {
      novosErros.email = "Digite o seu e-mail.";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      novosErros.email = "Digite um e-mail válido.";
    }

    if (!senha) {
      novosErros.senha = "Crie uma senha.";
    } else if (senha.length < 6) {
      novosErros.senha = "A senha precisa ter pelo menos 6 caracteres.";
    }

    if (!confirmar) {
      novosErros.confirmar = "Repita a senha.";
    } else if (confirmar !== senha) {
      novosErros.confirmar = "As senhas não são iguais.";
    }

    return novosErros;
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErroGeral("");

    const novosErros = validar();
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setCarregando(true);
    try {
      // TODO (etapa do back-end): trocar este bloco pela criação do usuário no Back4App.
      await new Promise((resolver) => setTimeout(resolver, 700)); // finge que está pensando

      // Para você ver a mensagem de erro funcionando, este e-mail "já existe".
      if (email.trim().toLowerCase() === "ja@cadastrado.com") {
        throw new Error("email-em-uso");
      }

      entrar({ nome: nome.trim(), email: email.trim() });
      router.push("/pastas");
    } catch (erro) {
      setErroGeral("Este e-mail já está cadastrado. Tente entrar na sua conta.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="auth">
      <div className="auth-cartao">
        <div className="auth-topo">
          <Logo tamanho={56} />
          <h1>Crie a sua conta</h1>
          <p>É grátis e leva menos de um minuto.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {erroGeral && (
            <div className="alerta alerta-erro" role="alert">
              {erroGeral}
            </div>
          )}

          <div className={`campo ${erros.nome ? "com-erro" : ""}`}>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              placeholder="Como quer ser chamado(a)?"
              autoComplete="name"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
            />
            {erros.nome && <p className="campo-erro">{erros.nome}</p>}
          </div>

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
                placeholder="Mínimo de 6 caracteres"
                autoComplete="new-password"
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
                <span className="spinner" /> Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </button>
        </form>

        <p className="auth-rodape">
          Já tem conta?{" "}
          <Link href="/entrar" className="link">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  );
}
