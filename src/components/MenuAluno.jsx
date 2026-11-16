"use client";

// Usado no topo das telas internas (pastas, materiais, resumo).
// O menu visível já vem do layout (Navbar), então aqui ele só PROTEGE a tela:
// se a pessoa não estiver logada, manda para Entrar.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";

export default function MenuAluno() {
  const router = useRouter();
  const usuario = useAuth((estado) => estado.usuario);
  const hidratado = useAuth((estado) => estado.hidratado);

  // Confere só quando a tela abre (depois de ler o login salvo no navegador).
  // Quando a pessoa clica em Sair, o Navbar já leva para o início.
  useEffect(() => {
    if (hidratado && !usuario) router.replace("/entrar");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidratado]);

  return null;
}
