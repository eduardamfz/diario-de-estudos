"use client";

// Menu do topo, igual em todas as telas.
// Deslogado: mostra Entrar e Criar conta.
// Logado: mostra o nome, Minhas pastas e Sair.
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { useAuth } from "@/store/useAuth";

export default function Navbar() {
  const router = useRouter();
  const usuario = useAuth((estado) => estado.usuario);
  const sair = useAuth((estado) => estado.sair);

  function handleSair() {
    sair();
    router.push("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-conteudo">
        <Link href="/" className="logo">
          <Logo />
          <span>Diário de Estudos</span>
        </Link>

        <nav className="navbar-acoes" aria-label="Menu principal">
          {usuario ? (
            <>
              <span className="navbar-usuario">Olá, {usuario.nome}</span>
              <Link href="/pastas" className="btn btn-contorno">
                Minhas pastas
              </Link>
              <button type="button" className="btn btn-primario" onClick={handleSair}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/entrar" className="btn btn-contorno">
                Entrar
              </Link>
              <Link href="/cadastro" className="btn btn-primario">
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
