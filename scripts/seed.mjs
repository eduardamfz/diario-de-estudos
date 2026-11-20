// Cria o usuário de demonstração e os dados iniciais (rode UMA vez, veja o tutorial).
//
//   SUPABASE_SECRET_KEY=suachave node --env-file=.env.local scripts/seed.mjs
//
// O que ele faz:
//   - cria o usuário demo@diario.com (senha demo1234), já confirmado
//   - cria 2 pastas, 4 materiais e 2 resumos para esse usuário
// (as 4 dicas de estudo já foram criadas pelo supabase/schema.sql)
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

if (!url || !secret) {
  console.error(
    "Faltam dados. Confira se o .env.local tem NEXT_PUBLIC_SUPABASE_URL e rode com SUPABASE_SECRET_KEY=... na frente (veja o tutorial)."
  );
  process.exit(1);
}

// Com a chave secreta este script ignora as regras de segurança. Só rode no seu computador.
const admin = createClient(url, secret, { auth: { autoRefreshToken: false, persistSession: false } });

const EMAIL = "demo@diario.com";
const SENHA = "demo1234";

function falhar(mensagem, erro) {
  console.error(mensagem, erro?.message ?? erro);
  process.exit(1);
}

// 1) usuário de demonstração
let usuarioId;
const criado = await admin.auth.admin.createUser({
  email: EMAIL,
  password: SENHA,
  email_confirm: true,
  user_metadata: { nome: "Demonstração" },
});
if (criado.error) {
  if (criado.error.code !== "email_exists") falhar("Não foi possível criar o usuário:", criado.error);
  const lista = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (lista.error) falhar("Não foi possível listar os usuários:", lista.error);
  usuarioId = lista.data.users.find((u) => u.email === EMAIL)?.id;
  if (!usuarioId) falhar("O usuário demo existe, mas não foi encontrado.");
  console.log("Usuário já existia:", EMAIL);
} else {
  usuarioId = criado.data.user.id;
  console.log("Usuário criado:", EMAIL);
}

// 2) já tem pastas? então não faz nada
const { count, error: erroContagem } = await admin
  .from("pastas")
  .select("id", { count: "exact", head: true })
  .eq("dono", usuarioId);
if (erroContagem) falhar("Não achei a tabela pastas. Você rodou o supabase/schema.sql (Passo 5)?", erroContagem);
if (count > 0) {
  console.log("As pastas de exemplo já existem. Nada a fazer.");
  process.exit(0);
}

// 3) pastas
const pastas = await admin
  .from("pastas")
  .insert([
    { dono: usuarioId, nome: "História", descricao: "Revolução Francesa e Idade Moderna.", cor: "#6D28D9" },
    { dono: usuarioId, nome: "Biologia", descricao: "Células e divisão celular.", cor: "#16A34A" },
  ])
  .select();
if (pastas.error) falhar("Erro ao criar as pastas:", pastas.error);
const historia = pastas.data.find((p) => p.nome === "História").id;
const biologia = pastas.data.find((p) => p.nome === "Biologia").id;

// 4) materiais
const materiais = await admin
  .from("materiais")
  .insert([
    { dono: usuarioId, pasta_id: historia, tipo: "texto", titulo: "Revolução Francesa", conteudo: "A Revolução Francesa começou em 1789 e acabou com o poder absoluto do rei. Ela defendia liberdade, igualdade e fraternidade." },
    { dono: usuarioId, pasta_id: historia, tipo: "link", titulo: "Idade Moderna (Wikipédia)", conteudo: "Leitura de apoio sobre a Idade Moderna.", endereco: "https://pt.wikipedia.org/wiki/Idade_Moderna" },
    { dono: usuarioId, pasta_id: biologia, tipo: "texto", titulo: "O que é mitose", conteudo: "A mitose é a divisão de uma célula em duas células iguais. Ela serve para o crescimento e para a renovação do corpo." },
    { dono: usuarioId, pasta_id: biologia, tipo: "video", titulo: "Mitose (videoaula)", conteudo: "Videoaula sobre divisão celular.", endereco: "https://www.youtube.com/watch?v=kfofwQOMc0o" },
  ])
  .select();
if (materiais.error) falhar("Erro ao criar os materiais:", materiais.error);

// 5) resumos (um por pasta)
const resumos = await admin.from("resumos").insert([
  {
    dono: usuarioId,
    pasta_id: historia,
    blocos: [{ id: "h1", tipo: "texto", titulo: "Revolução Francesa", frase: "A Revolução Francesa começou em 1789 e acabou com o poder absoluto do rei." }],
  },
  {
    dono: usuarioId,
    pasta_id: biologia,
    blocos: [{ id: "b1", tipo: "texto", titulo: "O que é mitose", frase: "A mitose é a divisão de uma célula em duas células iguais." }],
  },
]);
if (resumos.error) falhar("Erro ao criar os resumos:", resumos.error);

console.log("Pronto! Dados criados. Entre no site com", EMAIL, "/", SENHA);
