-- Diário de Estudos: tabelas e regras de segurança.
-- Rode UMA vez: Supabase > SQL Editor > New query > cole tudo > Run.

-- =========================================================
-- 1) TABELAS
-- =========================================================

-- Pastas (CRUD completo). "dono" é a pessoa logada (preenchido sozinho pelo banco).
create table public.pastas (
  id           uuid primary key default gen_random_uuid(),
  dono         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome         text not null check (char_length(trim(nome)) > 0),
  descricao    text not null default '',
  cor          text not null default '#6D28D9',
  criado_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Materiais (CRUD completo). Se a pasta for apagada, os materiais dela somem junto.
create table public.materiais (
  id           uuid primary key default gen_random_uuid(),
  dono         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  pasta_id     uuid not null references public.pastas (id) on delete cascade,
  tipo         text not null check (tipo in ('texto', 'video', 'slide', 'link')),
  titulo       text not null check (char_length(trim(titulo)) > 0),
  conteudo     text not null default '',
  endereco     text not null default '',
  criado_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Resumos (exibição). Um por pasta.
create table public.resumos (
  id           uuid primary key default gen_random_uuid(),
  dono         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  pasta_id     uuid not null unique references public.pastas (id) on delete cascade,
  blocos       jsonb not null default '[]'::jsonb,
  criado_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Dicas de estudo (exibição). Todo mundo pode ler.
create table public.dicas (
  id           uuid primary key default gen_random_uuid(),
  titulo       text not null,
  texto        text not null,
  criado_em    timestamptz not null default now()
);

create index pastas_dono_idx on public.pastas (dono);
create index materiais_pasta_idx on public.materiais (pasta_id);

-- =========================================================
-- 2) "atualizado_em" muda sozinho quando a linha é editada
-- =========================================================
create function public.atualizar_data()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger pastas_atualizar    before update on public.pastas    for each row execute function public.atualizar_data();
create trigger materiais_atualizar before update on public.materiais for each row execute function public.atualizar_data();
create trigger resumos_atualizar   before update on public.resumos   for each row execute function public.atualizar_data();

-- =========================================================
-- 3) SEGURANÇA (RLS): cada pessoa só vê e mexe nas próprias coisas
-- =========================================================
alter table public.pastas    enable row level security;
alter table public.materiais enable row level security;
alter table public.resumos   enable row level security;
alter table public.dicas     enable row level security;

create policy "pastas: só do dono" on public.pastas
  for all to authenticated
  using (dono = (select auth.uid()))
  with check (dono = (select auth.uid()));

create policy "materiais: só do dono" on public.materiais
  for all to authenticated
  using (dono = (select auth.uid()))
  with check (
    dono = (select auth.uid())
    and exists (select 1 from public.pastas p where p.id = pasta_id and p.dono = (select auth.uid()))
  );

create policy "resumos: só do dono" on public.resumos
  for all to authenticated
  using (dono = (select auth.uid()))
  with check (
    dono = (select auth.uid())
    and exists (select 1 from public.pastas p where p.id = pasta_id and p.dono = (select auth.uid()))
  );

create policy "dicas: todo mundo lê" on public.dicas
  for select to anon, authenticated
  using (true);

-- Permissões de uso das tabelas pela API
grant select, insert, update, delete on public.pastas, public.materiais, public.resumos to authenticated;
grant select on public.dicas to anon, authenticated;

-- =========================================================
-- 4) DICAS DE ESTUDO (dados iniciais)
-- =========================================================
insert into public.dicas (titulo, texto) values
  ('Revise em partes', 'Estudar 25 minutos e descansar 5 funciona melhor do que estudar por horas seguidas.'),
  ('Explique com suas palavras', 'Se você consegue explicar o assunto para alguém, é porque realmente entendeu.'),
  ('Revise no dia seguinte', 'Ler as anotações no dia seguinte ajuda a guardar o conteúdo por mais tempo.'),
  ('Faça perguntas', 'Transforme cada título do caderno em uma pergunta e tente respondê-la sem olhar.');
