# Configuração do MongoDB para Clarity Cash

## Passo 1: Criar conta no MongoDB Atlas

1. Acesse https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita
3. Crie um novo cluster (tier gratuito M0)

## Passo 2: Configurar acesso

1. No painel do MongoDB Atlas, vá em "Database Access"
2. Clique em "Add New Database User"
3. Crie um usuário com senha
4. Anote o usuário e senha

## Passo 3: Configurar Network Access

1. Vá em "Network Access"
2. Clique em "Add IP Address"
3. Selecione "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirme

## Passo 4: Obter Connection String

1. Vá em "Database" > "Connect"
2. Escolha "Connect your application"
3. Copie a connection string
4. Substitua `<password>` pela senha do usuário

## Passo 5: Configurar .env

Edite o arquivo `.env` na raiz do projeto:

```env
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/clarity-cash?retryWrites=true&w=majority
JWT_SECRET=seu_secret_jwt_super_seguro_aqui
```

## Passo 6: Deploy no Vercel

1. Faça push do código para GitHub
2. Conecte o repositório no Vercel
3. Adicione as variáveis de ambiente no dashboard do Vercel:
   - `MONGODB_URI`
   - `JWT_SECRET`
4. Deploy!

## Estrutura do Banco de Dados

O app cria automaticamente a collection `users` com a seguinte estrutura:

```json
{
  "_id": ObjectId,
  "email": "usuario@email.com",
  "password": "hash_bcrypt",
  "name": "Nome do Usuário",
  "createdAt": ISODate,
  "financeData": {
    "income": 0,
    "budgetRule": { "essentials": 50, "personal": 30, "investments": 20 },
    "expenses": [],
    "incomes": [],
    "investments": [],
    "recurringTransactions": [],
    "creditCards": [],
    "goals": [],
    "isOnboarded": false
  }
}
```

## Testando Localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:5173/auth para criar uma conta e testar.
