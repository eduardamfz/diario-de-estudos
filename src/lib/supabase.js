// Liga o site ao Supabase.
// As chaves ficam no arquivo .env.local (veja o tutorial). Elas NÃO vão para o GitHub.
// A chave "publishable" pode ficar no navegador: quem protege os dados são as
// regras (RLS) criadas no banco pelo arquivo supabase/schema.sql.
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CHAVE = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const configurado = Boolean(URL && CHAVE);

// O Supabase guarda o login no navegador (localStorage) sozinho.
export const supabase = configurado ? createClient(URL, CHAVE) : null;
