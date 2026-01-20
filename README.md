# 💰 Clarity Cash

> Controle financeiro pessoal inteligente e minimalista

## 📖 Sobre o Projeto

**Clarity Cash** é uma aplicação web moderna para gestão financeira pessoal, focada em simplicidade e clareza. Desenvolvida com React e TypeScript, oferece uma experiência intuitiva para controlar gastos, investimentos, cartões de crédito e metas financeiras.

O projeto nasceu da necessidade de ter uma ferramenta de controle financeiro que seja:
- ✨ **Simples** - Interface limpa sem complexidade desnecessária
- 🎯 **Focada** - Apenas o essencial para controle financeiro efetivo
- 🚀 **Rápida** - Experiência fluida e responsiva
- 🔒 **Segura** - Dados armazenados com segurança no MongoDB

## ✨ Funcionalidades

### 💰 Gestão Financeira
- **Dashboard Completo** - Visão geral de receitas, gastos e saldo disponível
- **Múltiplos Cartões** - Controle individual de cartões de crédito
- **Compras Parceladas** - Sistema inteligente de parcelas automáticas
- **Contas Recorrentes** - Gerenciamento de despesas fixas mensais
- **Receitas Extras** - Registro de receitas adicionais
- **Categorização** - Gastos organizados por categoria e tipo (Essencial/Pessoal/Investimento)

### 📊 Relatórios e Análises
- **Gráficos Interativos** - Pizza (categorias) e Barras (tipos de gasto)
- **Tendências** - Análise dos últimos 6 meses
- **Histórico Mensal** - Navegação por mês com filtros
- **Insights** - Sugestões de gasto diário e investimento
- **Exportação** - Dados em formato JSON

### 🎯 Planejamento
- **Metas Financeiras** - Defina e acompanhe objetivos
- **Orçamento Inteligente** - Sugestões baseadas na renda
- **Controle de Investimentos** - Separação clara entre gastos e investimentos

### 🎨 Experiência do Usuário
- **Modo Escuro/Claro** - Tema adaptável
- **Design Responsivo** - Funciona em qualquer dispositivo
- **Landing Page Moderna** - Carrossel interativo com preview das funcionalidades
- **PWA Ready** - Instalável como aplicativo

## 🛠️ Tecnologias

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna
- **TailwindCSS** - Estilização
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones
- **React Router** - Navegação SPA

### Backend
- **Vercel Serverless Functions** - API endpoints
- **MongoDB** - Banco de dados NoSQL
- **JWT** - Autenticação

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta MongoDB (Atlas ou local)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/clarity-cash.git
cd clarity-cash

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais MongoDB

# Execute em desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
MONGODB_URI=sua_connection_string_mongodb
JWT_SECRET=seu_secret_jwt
```

## 📦 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente no dashboard
3. Deploy automático a cada push na main

```bash
# Ou via CLI
npm i -g vercel
vercel --prod
```

## 🏗️ Arquitetura

```
┌─────────────────────────────────────┐
│   Frontend (React + TypeScript)    │
│   - Components                      │
│   - Pages                           │
│   - Hooks                           │
└──────────────┬──────────────────────┘
               │ HTTP/REST
               ↓
┌─────────────────────────────────────┐
│   API (Vercel Functions)            │
│   - /api/auth/*                     │
│   - /api/users                      │
└──────────────┬──────────────────────┘
               │ MongoDB Driver
               ↓
┌─────────────────────────────────────┐
│   MongoDB Atlas                     │
│   Collection: users                 │
│   - Auth data                       │
│   - Finance data (embedded)         │
└─────────────────────────────────────┘
```

## 📁 Estrutura do Projeto

```
clarity-cash/
├── api/                    # Serverless functions
│   ├── auth/
│   │   ├── login.ts
│   │   └── register.ts
│   └── users.ts
├── src/
│   ├── components/         # Componentes React
│   │   ├── finance/       # Componentes financeiros
│   │   └── ui/            # Componentes UI base
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilitários e serviços
│   ├── pages/             # Páginas da aplicação
│   └── App.tsx            # Componente raiz
├── public/                # Assets estáticos
└── vercel.json           # Configuração Vercel
```

## 🎯 Roadmap

### ✅ Concluído
- [x] Interface completa e responsiva
- [x] Sistema de autenticação
- [x] Integração com MongoDB
- [x] Gestão de cartões e parcelas
- [x] Relatórios e gráficos
- [x] Landing page moderna
- [x] Deploy em produção

### 🚧 Em Desenvolvimento
- [ ] Notificações push
- [ ] Modo offline completo
- [ ] Importação de extratos bancários

### 🔮 Futuro
- [ ] Integração Open Banking
- [ ] IA para categorização automática
- [ ] App mobile nativo
- [ ] Múltiplas moedas
- [ ] Compartilhamento de orçamento familiar

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Lucas Barros**
- GitHub: [@lucashcb](https://github.com/lucashcb)
- Email: lucas.hcb0405@gmail.com

---

**Desenvolvido com ❤️ para simplificar o controle financeiro pessoal**