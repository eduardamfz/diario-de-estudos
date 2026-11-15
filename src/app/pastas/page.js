"use client";

// TELA 5: Minhas pastas ( /pastas )
// PROVISÓRIA: por enquanto é só um aviso, para o login ter para onde ir.
// A tela de verdade (lista de pastas, criar, editar e excluir) vem depois.
import Link from "next/link";
import { useAuth } from "@/store/useAuth";

export default function MinhasPastas() {
  const usuario = useAuth((estado) => estado.usuario);

  return (
    <section className="pagina-simples">
      <h1>Minhas pastas</h1>
      {usuario ? (
        <p>Olá, {usuario.nome}! Esta tela ainda está em construção (Tela 5).</p>
      ) : (
        <p>
          Você precisa entrar para ver as suas pastas.{" "}
          <Link href="/entrar" className="link">
            Ir para Entrar
          </Link>
        </p>
      )}
    </section>
  );
}
