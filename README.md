
# FehClaude Cloud Storage

FehClaude é uma plataforma moderna de armazenamento em nuvem, com foco em simplicidade, segurança, performance e experiência do usuário. Permite upload, visualização, download, organização e compartilhamento de arquivos de diversos tipos (imagens, vídeos, músicas, PDFs, documentos e mais) com interface responsiva e recursos avançados.


## Principais Funcionalidades

- Upload e download de arquivos de qualquer tipo
- Visualização de imagens, vídeos, músicas, PDFs e textos diretamente no navegador
- Renomear, excluir e organizar arquivos
- Download e exclusão em lote
- Compartilhamento avançado (links, permissões)
- Sincronização e histórico de versões
- Interface responsiva e acessível
- Autenticação segura (Supabase)
- Suporte a temas e personalização

git clone <YOUR_GIT_URL>
npm i
npm run dev

## Como rodar o projeto localmente

Pré-requisitos: Node.js 18+, npm 9+

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

Abra http://localhost:8080 no navegador.

## Scripts úteis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — gera build de produção
- `npm run preview` — serve build de produção localmente
- `npm run lint` — executa linter

## Rodando testes

> (Adicione testes unitários/integrados em breve)

## Estrutura do projeto

- `src/pages/` — páginas principais (Dashboard, Login, etc)
- `src/components/` — componentes reutilizáveis (UI, FileList, Preview, etc)
- `src/hooks/` — hooks customizados
- `src/types/` — tipagens globais
- `public/` — assets estáticos

## Principais dependências

- React, TypeScript, Vite
- Tailwind CSS, shadcn-ui, Radix UI
- Supabase (auth e storage)
- React Query, Framer Motion

## Segurança

- Inputs validados e protegidos contra XSS
- Autenticação via Supabase
- Download seguro de arquivos
- Recomenda-se usar HTTPS em produção

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha feature'`
4. Push na branch: `git push origin minha-feature`
5. Abra um Pull Request

## Licença

MIT

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6eef339e-c514-4d17-a4b9-02e353947436) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
