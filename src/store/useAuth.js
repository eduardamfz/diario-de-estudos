import { create } from "zustand";
import { persist } from "zustand/middleware";

// Estado global do login.
// "persist" guarda o usuário no navegador (localStorage), então atualizar
// a página (F5) não faz a pessoa sair da conta.
export const useAuth = create(
  persist(
    (set) => ({
      usuario: null, // { nome, email } quando logado
      hidratado: false, // true depois de ler o que estava salvo no navegador
      entrar: (usuario) => set({ usuario }),
      sair: () => set({ usuario: null }),
    }),
    {
      name: "diario-auth",
      partialize: (estado) => ({ usuario: estado.usuario }),
      skipHydration: true, // o Navbar faz a leitura (evita erro de hidratação)
      onRehydrateStorage: () => () => useAuth.setState({ hidratado: true }),
    }
  )
);
