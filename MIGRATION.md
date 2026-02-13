# Migração para Nova API Backend

## ✅ Concluído

### Removido:
- ❌ Pasta `/api` com Vercel Serverless Functions
- ❌ `authService.ts` antigo
- ❌ `financeService.ts` antigo
- ❌ `vercel.json`
- ❌ Implementação antiga de autenticação
- ❌ Página Settings antiga (salva como Settings.old.tsx)

### Implementado:
- ✅ Cliente Axios configurado (`/src/lib/api.ts`)
- ✅ Serviço de autenticação (`/src/lib/auth.service.ts`)
- ✅ Serviço de usuário (`/src/lib/user.service.ts`)
- ✅ Página de Auth atualizada
- ✅ Página de Settings completamente reescrita
- ✅ Interceptors para JWT automático
- ✅ Tratamento de erro 401 (logout automático)
- ✅ Variável de ambiente para API URL

## 🔧 Configuração

### 1. Criar arquivo `.env`:
```bash
cp .env.example .env
```

### 2. Configurar URL da API:
```env
VITE_API_URL=http://localhost:8080/api
```

### 3. Instalar dependências (se necessário):
```bash
npm install axios
```

## 📋 Rotas Implementadas

### Autenticação (`/api/auth`)
- `POST /auth/login` - Login com email/senha
- `POST /auth/register` - Registro de novo usuário

### Usuário (`/api/users`)
- `GET /users/profile` - Buscar perfil do usuário logado
- `PUT /users/profile` - Atualizar perfil
- `DELETE /users` - Deletar conta
- `GET /users` - Listar todos usuários (admin)

## 🎯 Próximos Passos

### Pendente de Implementação:
1. **Dados Financeiros** - Migrar useFinance para usar API backend
2. **Cartões de Crédito** - Endpoints de CRUD
3. **Despesas** - Endpoints de CRUD
4. **Investimentos** - Endpoints de CRUD
5. **Metas** - Endpoints de CRUD
6. **Relatórios** - Endpoints de analytics

### Componentes que Precisam Atualização:
- `useFinance.ts` - Remover localStorage, usar API
- `Index.tsx` - Dashboard com dados da API
- `Reports.tsx` - Relatórios da API
- `Planning.tsx` - Metas da API
- `History.tsx` - Histórico da API
- `Investments.tsx` - Investimentos da API

## 🚨 Importante

- Token JWT é armazenado em `localStorage` com chave `token`
- Todas as requisições autenticadas incluem header `Authorization: Bearer {token}`
- Erro 401 faz logout automático e redireciona para `/auth`
- Backend deve estar rodando em `http://localhost:8080`

## 🧪 Testando

1. Inicie o backend Java
2. Inicie o frontend: `npm run dev`
3. Acesse: `http://localhost:5173`
4. Crie uma conta ou faça login
5. Acesse Settings para configurar perfil financeiro
