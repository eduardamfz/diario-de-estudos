# Diário de Estudos

Um caderno de estudos online. O aluno cria uma pasta para cada matéria, guarda textos, links de vídeos, slides e outros links, e vê um resumo de cada pasta.

Projeto final da disciplina de Front-end.

## Integrantes

- Maria Eduarda Fernandes
- Luan Rhikelmy

## Links

- Site: https://diario-de-estudos-one.vercel.app
- Login de teste: `demo@diario.com` / `demo1234`

## Tecnologias

- Next.js (React) com CSS feito à mão
- Zustand (estado global)
- TanStack Query (busca e alteração de dados)
- Supabase (login e banco de dados)
- Vercel (publicação)

## O que o site tem

- Login, cadastro, logout e "esqueci minha senha"
- CRUD completo de **Pastas** e de **Materiais**
- Exibição de **Dicas** (Maria Eduarda) e de **Resumos** (Luan)

## Telas

| Tela | Rota | Quem fez |
| --- | --- | --- |
| Início | `/` | Maria Eduarda |
| Entrar | `/entrar` | Maria Eduarda |
| Criar conta | `/cadastro` | Maria Eduarda |
| Esqueci minha senha | `/esqueci-senha` | Maria Eduarda |
| Nova senha | `/nova-senha` | Maria Eduarda |
| Minhas pastas | `/pastas` | Maria Eduarda |
| Pasta | `/pastas/[id]` | Luan |
| Material | `/pastas/[id]/material/novo` e `/pastas/[id]/material/[materialId]` | Luan |
| Resumo | `/pastas/[id]/resumo` | Luan |