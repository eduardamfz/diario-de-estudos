// TODAS as conversas com o Supabase ficam neste arquivo.
// As telas não falam com o Supabase direto: elas usam os hooks de hooks.js,
// que chamam as funções daqui (TanStack Query).
//
// Tabelas no Supabase (criadas por supabase/schema.sql):
//   auth.users -> já existe (e-mail e senha). O nome fica junto, em "user_metadata"
//   pastas     -> nome, descricao, cor, dono          (CRUD completo)
//   materiais  -> pasta_id, tipo, titulo, conteudo, endereco (CRUD completo)
//   dicas      -> titulo, texto                       (só exibição)
//   resumos    -> pasta_id, blocos                    (só exibição / gerado)
import { supabase, configurado } from "./supabase";

// Cria um erro com um "codigo" simples para as telas entenderem.
// "detalhe" guarda o texto técnico do Supabase, para a tela poder mostrar o motivo real.
function erroApp(codigo, mensagem, detalhe = "") {
  const erro = new Error(mensagem);
  erro.codigo = codigo;
  erro.detalhe = detalhe;
  return erro;
}

// Traduz os erros mais comuns do Supabase para um codigo simples
function codigoDoErro(error) {
  const texto = `${error.code ?? ""} ${error.message ?? ""}`.toLowerCase();
  if (texto.includes("already") || texto.includes("user_already_exists")) return "email-em-uso";
  if (texto.includes("email_address_invalid") || texto.includes("is invalid")) return "email-invalido";
  if (texto.includes("rate_limit") || texto.includes("rate limit") || error.status === 429) return "limite";
  if (texto.includes("weak_password") || texto.includes("password should")) return "senha-fraca";
  if (texto.includes("signup_disabled") || texto.includes("signups not allowed")) return "cadastro-desligado";
  return "rede";
}

function cliente() {
  if (!configurado) {
    throw erroApp("sem-chaves", "Faltam as chaves do Supabase. Crie o arquivo .env.local (veja o tutorial).");
  }
  return supabase;
}

// Se o Supabase devolveu erro, lança. Senão, devolve os dados.
function conferir({ data, error }) {
  if (error) {
    const erro = erroApp("banco", error.message);
    erro.original = error;
    throw erro;
  }
  return data;
}

// Id que não é um uuid (ex.: "1") faz o Postgres dar erro 22P02: tratamos como "não achou"
const idInvalido = (error) => error?.code === "22P02";

// ---------------- Conta ----------------

const paraUsuario = (u) => ({
  nome: u.user_metadata?.nome || String(u.email || "").split("@")[0],
  email: u.email,
});

export async function cadastrar({ nome, email, senha }) {
  const { data, error } = await cliente().auth.signUp({
    email: email.toLowerCase(),
    password: senha,
    options: { data: { nome } },
  });
  if (error) throw erroApp(codigoDoErro(error), error.message, error.message);
  // Se o e-mail já existe e a confirmação está ligada, o Supabase devolve um usuário "vazio"
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    throw erroApp("email-em-uso", "E-mail já cadastrado.");
  }
  // Sem sessão = o projeto está pedindo confirmação de e-mail (veja o tutorial, Passo 2)
  if (!data.session) {
    throw erroApp("confirmar-email", "Confirme o e-mail para entrar.");
  }
  return paraUsuario(data.user);
}

export async function login({ email, senha }) {
  const { data, error } = await cliente().auth.signInWithPassword({
    email: email.toLowerCase(),
    password: senha,
  });
  if (error) {
    if (error.code === "invalid_credentials" || /invalid login/i.test(error.message)) {
      throw erroApp("credenciais", "E-mail ou senha incorretos.");
    }
    if (error.code === "email_not_confirmed") {
      throw erroApp("confirmar-email", "Confirme o e-mail para entrar.");
    }
    throw erroApp("rede", error.message);
  }
  return paraUsuario(data.user);
}

export async function logout() {
  if (configurado) await supabase.auth.signOut();
}

// true se ainda existe um login válido guardado no navegador
export async function sessaoAtiva() {
  if (!configurado) return false;
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}

// Manda o e-mail com o link para criar uma senha nova
export async function pedirNovaSenha(email) {
  const { error } = await cliente().auth.resetPasswordForEmail(email.toLowerCase(), {
    redirectTo: `${window.location.origin}/nova-senha`,
  });
  if (error) throw erroApp(codigoDoErro(error), error.message, error.message);
}

// Usada na tela /nova-senha (a pessoa chegou pelo link do e-mail)
export async function trocarSenha(novaSenha) {
  const { data, error } = await cliente().auth.updateUser({ password: novaSenha });
  if (error) throw erroApp("rede", error.message);
  return paraUsuario(data.user);
}

// ---------------- Pastas ----------------

const paraPasta = (p) => ({
  id: p.id,
  nome: p.nome,
  descricao: p.descricao || "",
  cor: p.cor || "#6D28D9",
  totalMateriais: p.materiais?.[0]?.count ?? 0,
});

// O banco só devolve as pastas da pessoa logada (regra RLS)
export async function listarPastas() {
  const dados = conferir(
    await cliente().from("pastas").select("*, materiais(count)").order("criado_em", { ascending: true })
  );
  return dados.map(paraPasta);
}

export async function buscarPasta(id) {
  const resposta = await cliente().from("pastas").select("*").eq("id", id).maybeSingle();
  if (idInvalido(resposta.error)) return null;
  const pasta = conferir(resposta);
  return pasta ? paraPasta(pasta) : null;
}

export async function salvarPasta({ id, nome, descricao, cor }) {
  const campos = { nome, descricao, cor };
  if (id) conferir(await cliente().from("pastas").update(campos).eq("id", id));
  else conferir(await cliente().from("pastas").insert(campos)); // "dono" é preenchido pelo banco
}

// Apaga a pasta. Os materiais e o resumo dela somem juntos (ON DELETE CASCADE no SQL)
export async function excluirPasta(id) {
  conferir(await cliente().from("pastas").delete().eq("id", id));
}

// ---------------- Dica de estudo (só exibição) ----------------

export async function buscarDica() {
  const dicas = conferir(await cliente().from("dicas").select("*").order("criado_em"));
  if (dicas.length === 0) return null;
  const dica = dicas[new Date().getDate() % dicas.length];
  return { id: dica.id, titulo: dica.titulo, texto: dica.texto };
}

// ---------------- Materiais ----------------

const paraMaterial = (m) => ({
  id: m.id,
  pastaId: m.pasta_id,
  tipo: m.tipo,
  titulo: m.titulo,
  conteudo: m.conteudo || "",
  endereco: m.endereco || "",
  atualizadoEm: new Date(m.atualizado_em).toISOString(),
});

export async function listarMateriais(pastaId) {
  const resposta = await cliente()
    .from("materiais")
    .select("*")
    .eq("pasta_id", pastaId)
    .order("atualizado_em", { ascending: false });
  if (idInvalido(resposta.error)) return [];
  return conferir(resposta).map(paraMaterial);
}

export async function buscarMaterial(id) {
  const resposta = await cliente().from("materiais").select("*").eq("id", id).maybeSingle();
  if (idInvalido(resposta.error)) return null;
  const material = conferir(resposta);
  return material ? paraMaterial(material) : null;
}

export async function salvarMaterial({ id, pastaId, tipo, titulo, conteudo, endereco }) {
  const campos = { tipo, titulo, conteudo, endereco };
  if (id) conferir(await cliente().from("materiais").update(campos).eq("id", id));
  else conferir(await cliente().from("materiais").insert({ ...campos, pasta_id: pastaId }));
}

export async function excluirMaterial(id) {
  conferir(await cliente().from("materiais").delete().eq("id", id));
}

// ---------------- Resumo ----------------

const paraResumo = (r) => ({
  pastaId: r.pasta_id,
  blocos: r.blocos || [],
  atualizadoEm: new Date(r.atualizado_em).toISOString(),
});

const primeiraFrase = (t = "") => (t.match(/[^.!?]+[.!?]/)?.[0] ?? t).trim();

export async function buscarResumo(pastaId) {
  const resposta = await cliente().from("resumos").select("*").eq("pasta_id", pastaId).maybeSingle();
  if (idInvalido(resposta.error)) return null;
  const resumo = conferir(resposta);
  return resumo ? paraResumo(resumo) : null;
}

// Sem IA: título + primeira frase de cada material de texto.
export async function gerarResumo(pastaId) {
  const materiais = (await listarMateriais(pastaId)).filter((m) => m.tipo === "texto");
  const blocos = materiais.map((m) => ({
    id: m.id,
    tipo: m.tipo,
    titulo: m.titulo,
    frase: primeiraFrase(m.conteudo),
  }));

  // upsert = cria o resumo se não existir, ou atualiza se já existir (1 por pasta)
  const resumo = conferir(
    await cliente()
      .from("resumos")
      .upsert({ pasta_id: pastaId, blocos }, { onConflict: "pasta_id" })
      .select()
      .single()
  );
  return paraResumo(resumo);
}
