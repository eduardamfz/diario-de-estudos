// Dados de exemplo (escritos no código). Na etapa do Back4App, cada função
// abaixo vira uma consulta do TanStack Query e este arquivo é apagado.
const esperar = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const TIPOS = [
  { valor: "texto", rotulo: "Texto" },
  { valor: "video", rotulo: "Vídeo" },
  { valor: "slide", rotulo: "Slide" },
  { valor: "link", rotulo: "Link" },
];
export const rotuloDoTipo = (t) => TIPOS.find((x) => x.valor === t)?.rotulo ?? t;

let pastas = [
  { id: "1", nome: "História", descricao: "Revolução Francesa e Idade Moderna", cor: "#6D28D9" },
  { id: "2", nome: "Biologia", descricao: "Citologia e divisão celular", cor: "#A78BFA" },
];

let materiais = [
  { id: "m1", pastaId: "1", tipo: "texto", titulo: "Revolução Francesa: causas",
    conteudo: "A Revolução Francesa começou em 1789, depois de uma grave crise financeira. O povo pagava impostos altos enquanto a nobreza mantinha seus privilégios. As ideias iluministas deram força ao pedido de igualdade.",
    endereco: "", atualizadoEm: "2026-11-10T14:00:00.000Z" },
  { id: "m2", pastaId: "1", tipo: "texto", titulo: "Iluminismo: ideias principais",
    conteudo: "O Iluminismo defendia a razão como guia da sociedade. Seus pensadores criticavam o poder absoluto dos reis. Liberdade e igualdade viraram palavras de ordem.",
    endereco: "", atualizadoEm: "2026-11-10T15:00:00.000Z" },
  { id: "m3", pastaId: "1", tipo: "slide", titulo: "Linha do tempo da Idade Moderna",
    conteudo: "Slides da aula 4.", endereco: "https://exemplo.com/slides/idade-moderna",
    atualizadoEm: "2026-11-11T09:00:00.000Z" },
  { id: "m4", pastaId: "2", tipo: "video", titulo: "Como funciona a mitose",
    conteudo: "Vídeo da aula sobre divisão celular.", endereco: "https://www.youtube.com/watch?v=exemplo",
    atualizadoEm: "2026-11-09T10:00:00.000Z" },
  { id: "m5", pastaId: "2", tipo: "texto", titulo: "Fases da mitose",
    conteudo: "A mitose tem quatro fases: prófase, metáfase, anáfase e telófase. Ao final, uma célula dá origem a duas células iguais.",
    endereco: "", atualizadoEm: "2026-11-13T10:00:00.000Z" },
];

let resumos = [
  { pastaId: "1", atualizadoEm: "2026-11-12T10:00:00.000Z",
    blocos: [
      { id: "m1", tipo: "texto", titulo: "Revolução Francesa: causas", frase: "A Revolução Francesa começou em 1789, depois de uma grave crise financeira." },
      { id: "m2", tipo: "texto", titulo: "Iluminismo: ideias principais", frase: "O Iluminismo defendia a razão como guia da sociedade." },
    ] },
  { pastaId: "2", atualizadoEm: "2026-11-11T10:00:00.000Z",
    blocos: [{ id: "m5", tipo: "texto", titulo: "Fases da mitose", frase: "A mitose tem quatro fases: prófase, metáfase, anáfase e telófase." }] },
];

const primeiraFrase = (t = "") => (t.match(/[^.!?]+[.!?]/)?.[0] ?? t).trim();

// ---- Pastas (Tela 5: Maria Eduarda) ----
export const CORES = ["#6D28D9", "#A78BFA", "#7C3AED", "#DB2777", "#0EA5E9", "#16A34A", "#F59E0B"];

const dicas = [
  { id: "d1", titulo: "Revise em partes", texto: "Estudar 25 minutos e descansar 5 funciona melhor do que estudar por horas seguidas." },
  { id: "d2", titulo: "Explique com suas palavras", texto: "Se você consegue explicar o assunto para alguém, é porque realmente entendeu." },
];

export async function listarPastas() {
  await esperar();
  return pastas.map((p) => ({ ...p, totalMateriais: materiais.filter((m) => m.pastaId === p.id).length }));
}
export async function salvarPasta(dados) {
  await esperar(500);
  if (dados.id) pastas = pastas.map((p) => (p.id === dados.id ? { ...p, ...dados } : p));
  else pastas = [...pastas, { ...dados, id: String(Date.now()) }];
}
// Apaga a pasta e tudo o que estava dentro dela
export async function excluirPasta(id) {
  await esperar(400);
  pastas = pastas.filter((p) => p.id !== id);
  materiais = materiais.filter((m) => m.pastaId !== id);
  resumos = resumos.filter((r) => r.pastaId !== id);
}
export async function buscarDica() {
  await esperar(300);
  return dicas[new Date().getDate() % dicas.length];
}

export async function buscarPasta(id) { await esperar(); return pastas.find((p) => p.id === id) ?? null; }
export async function listarMateriais(pastaId) {
  await esperar();
  return materiais.filter((m) => m.pastaId === pastaId).sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
}
export async function buscarMaterial(id) { await esperar(300); return materiais.find((m) => m.id === id) ?? null; }
export async function salvarMaterial(dados) {
  await esperar(500);
  const agora = new Date().toISOString();
  if (dados.id) materiais = materiais.map((m) => (m.id === dados.id ? { ...m, ...dados, atualizadoEm: agora } : m));
  else materiais = [...materiais, { ...dados, id: "m" + Date.now(), atualizadoEm: agora }];
}
export async function excluirMaterial(id) { await esperar(300); materiais = materiais.filter((m) => m.id !== id); }
export async function buscarResumo(pastaId) { await esperar(); return resumos.find((r) => r.pastaId === pastaId) ?? null; }

// Sem IA: título + primeira frase de cada material de texto.
export async function gerarResumo(pastaId) {
  await esperar(700);
  const blocos = materiais
    .filter((m) => m.pastaId === pastaId && m.tipo === "texto")
    .map((m) => ({ id: m.id, tipo: m.tipo, titulo: m.titulo, frase: primeiraFrase(m.conteudo) }));
  const novo = { pastaId, blocos, atualizadoEm: new Date().toISOString() };
  resumos = [...resumos.filter((r) => r.pastaId !== pastaId), novo];
  return novo;
}
