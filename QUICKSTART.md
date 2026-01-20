# 🚀 Quick Start - Clarity Cash MVP

## Configuração Rápida (2 minutos)

### 1. Instale as dependências

```bash
npm install
```

### 2. Rode o projeto

```bash
npm run dev:all
```

Isso vai iniciar:
- Frontend em `http://localhost:8080`
- API em `http://localhost:3001`

### 3. Acesse e teste

1. Abra `http://localhost:8080/auth`
2. Crie uma conta
3. Faça login
4. Comece a usar!

## ⚠️ Nota Importante

Esta versão usa **banco de dados em memória** para facilitar o desenvolvimento.
Os dados serão perdidos quando você parar o servidor.

Para usar MongoDB em produção, veja `MONGODB_SETUP.md`.

## Comandos Disponíveis

```bash
npm run dev          # Apenas frontend
npm run dev:api      # Apenas API
npm run dev:all      # Frontend + API juntos
npm run build        # Build para produção
```

## Deploy no Vercel

1. Configure MongoDB Atlas (veja MONGODB_SETUP.md)
2. Faça push para GitHub
3. Conecte no Vercel
4. Adicione as variáveis de ambiente:
   - `MONGODB_URI`
   - `JWT_SECRET`
5. Deploy!

## Estrutura

```
/api                  # Serverless functions (produção)
/server-simple.mjs    # API em memória (desenvolvimento)
/server.mjs           # API com MongoDB (produção local)
/src                  # Frontend React
  /pages              # Páginas
  /components         # Componentes
  /hooks              # Custom hooks
  /lib                # Utilitários
```

## Troubleshooting

**API não responde?**
- Certifique-se que `npm run dev:api` está rodando
- Verifique se a porta 3001 está livre
- Veja os logs em `/tmp/api-simple.log`

**Erro 401 Unauthorized?**
- Faça logout e login novamente
- Limpe o localStorage do navegador

**Dados sumiram?**
- Normal! Esta versão usa memória
- Para persistência, configure MongoDB
