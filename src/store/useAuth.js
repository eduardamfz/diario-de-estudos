// Estado global do site (Zustand).
// Guarda quem está logado. O menu do topo e as telas protegidas leem daqui.
//
// Por enquanto o login é simulado. Na etapa do back-end, o login de verdade
// (Back4App) vai chamar `entrar(usuario)` com os dados do banco.
import { create } from "zustand";

export const useAuth = create((set) => ({
  usuario: null, // { nome, email } quando logado, null quando deslogado
  entrar: (usuario) => set({ usuario }),
  sair: () => set({ usuario: null }),
}));
