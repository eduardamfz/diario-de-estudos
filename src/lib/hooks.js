// Hooks do TanStack Query: as telas usam estes hooks para ler e mudar dados.
// - useQuery    = buscar dados (guarda em cache e mostra "carregando")
// - useMutation = criar / editar / excluir (e depois atualiza as listas)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";

// ---------- Ler ----------
export const usePastas = () => useQuery({ queryKey: ["pastas"], queryFn: api.listarPastas });

export const useDica = () =>
  useQuery({ queryKey: ["dica"], queryFn: api.buscarDica, staleTime: 1000 * 60 * 60 });

export const usePasta = (id) => useQuery({ queryKey: ["pasta", id], queryFn: () => api.buscarPasta(id) });

export const useMateriais = (pastaId) =>
  useQuery({ queryKey: ["materiais", pastaId], queryFn: () => api.listarMateriais(pastaId) });

export const useMaterial = (id) =>
  useQuery({ queryKey: ["material", id], queryFn: () => api.buscarMaterial(id), enabled: Boolean(id) });

export const useResumo = (pastaId) =>
  useQuery({ queryKey: ["resumo", pastaId], queryFn: () => api.buscarResumo(pastaId) });

// ---------- Mudar ----------
export function useSalvarPasta() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: api.salvarPasta,
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ["pastas"] });
      cliente.invalidateQueries({ queryKey: ["pasta"] });
    },
  });
}

export function useExcluirPasta() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: api.excluirPasta,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ["pastas"] }),
  });
}

export function useSalvarMaterial() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: api.salvarMaterial,
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ["materiais"] });
      cliente.invalidateQueries({ queryKey: ["material"] });
      cliente.invalidateQueries({ queryKey: ["pastas"] }); // o contador de materiais
    },
  });
}

export function useExcluirMaterial() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: api.excluirMaterial,
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ["materiais"] });
      cliente.invalidateQueries({ queryKey: ["pastas"] });
    },
  });
}

export function useGerarResumo() {
  const cliente = useQueryClient();
  return useMutation({
    mutationFn: api.gerarResumo,
    onSuccess: (resumo, pastaId) => cliente.setQueryData(["resumo", pastaId], resumo),
  });
}

// ---------- Conta ----------
export const useLogin = () => useMutation({ mutationFn: api.login });
export const useCadastrar = () => useMutation({ mutationFn: api.cadastrar });
export const usePedirNovaSenha = () => useMutation({ mutationFn: api.pedirNovaSenha });
export const useTrocarSenha = () => useMutation({ mutationFn: api.trocarSenha });
