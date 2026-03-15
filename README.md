# SmartClip

Base de SaaS em Next.js App Router para upload, processamento e publicacao de videos com Supabase, PagBank e arquitetura preparada para worker FFmpeg.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui style
- Supabase Auth + Storage
- Prisma sobre Postgres do Supabase
- PagBank Checkout Transparente

## Pastas principais

- `app`: rotas, layouts e route handlers
- `components`: UI reutilizavel e blocos de produto
- `services`: dados do produto, conteudo e configuracoes de negocio
- `lib`: helpers de Supabase, metadata, SEO e billing
- `prisma`: schema do banco
- `supabase/migrations`: SQL inicial para o projeto

## Como rodar

1. Copie `.env.example` para `.env.local`
2. Preencha as credenciais do Supabase e PagBank
3. Instale as dependencias com `npm install`
4. Gere o client Prisma com `npm run prisma:generate`
5. Rode `npm run dev`
