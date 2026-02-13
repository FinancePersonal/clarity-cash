# 💰 Clarity Cash

> Controle financeiro pessoal inteligente e minimalista

## 📖 Sobre o Projeto

**Clarity Cash** é uma aplicação web moderna para gestão financeira pessoal, focada em simplicidade e clareza. Desenvolvida com React + TypeScript no frontend e Java Spring Boot no backend, oferece uma experiência intuitiva para controlar gastos, investimentos, cartões de crédito e metas financeiras.

O projeto nasceu da necessidade de ter uma ferramenta de controle financeiro que seja:
- ✨ **Simples** - Interface limpa sem complexidade desnecessária
- 🎯 **Focada** - Apenas o essencial para controle financeiro efetivo
- 🚀 **Rápida** - Experiência fluida e responsiva
- 🔒 **Segura** - Autenticação JWT e dados protegidos

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
- **Orçamento Inteligente** - Regras 50/30/20, 50/20/30, 40/30/30 ou personalizado
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
- **Axios** - Cliente HTTP

### Backend
- **Java 17+** - Linguagem
- **Spring Boot** - Framework
- **Spring Security** - Autenticação/Autorização
- **JWT** - Tokens de autenticação
- **PostgreSQL** - Banco de dados
- **Swagger** - Documentação API

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Java 17+
- PostgreSQL
- npm ou yarn

### Backend (Java)

```bash
# Clone o repositório do backend
git clone https://github.com/seu-usuario/clarity-cash-api.git
cd clarity-cash-api

# Configure o banco de dados no application.properties
# Compile e execute
./mvnw spring-boot:run

# API estará disponível em http://localhost:8080
# Swagger em http://localhost:8080/swagger-ui.html
```

### Frontend (React)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/clarity-cash.git
cd clarity-cash

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com a URL da API

# Execute em desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:8080/api
```

## 📦 Deploy

### Backend
- Heroku, Railway, Render ou qualquer plataforma Java
- Configure variáveis de ambiente do banco de dados

### Frontend
- Vercel, Netlify ou qualquer plataforma de hospedagem estática
- Configure `VITE_API_URL` para apontar para API em produção

## 🏗️ Arquitetura

```
┌─────────────────────────────────────┐
│   Frontend (React + TypeScript)    │
│   - Components                      │
│   - Pages                           │
│   - Hooks                           │
└──────────────┬──────────────────────┘
               │ HTTP/REST + JWT
               ↓
┌─────────────────────────────────────┐
│   Backend (Spring Boot)             │
│   - Controllers                     │
│   - Services                        │
│   - Repositories                    │
└──────────────┬──────────────────────┘
               │ JPA/Hibernate
               ↓
┌─────────────────────────────────────┐
│   PostgreSQL Database               │
│   - users                           │
│   - expenses                        │
│   - credit_cards                    │
│   - goals                           │
└─────────────────────────────────────┘
```

## 📁 Estrutura do Projeto

```
clarity-cash/
├── src/
│   ├── components/         # Componentes React
│   │   ├── finance/       # Componentes financeiros
│   │   └── ui/            # Componentes UI base
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Serviços e utilitários
│   │   ├── api.ts        # Cliente Axios
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── pages/             # Páginas da aplicação
│   └── App.tsx            # Componente raiz
├── public/                # Assets estáticos
└── .env.example          # Exemplo de variáveis
```

## 🔐 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Usuário (requer autenticação)
- `GET /api/users/profile` - Buscar perfil
- `PUT /api/users/profile` - Atualizar perfil
- `DELETE /api/users` - Deletar conta

Veja documentação completa em: `http://localhost:8080/swagger-ui.html`

## 🎯 Roadmap

### ✅ Concluído
- [x] Interface completa e responsiva
- [x] Sistema de autenticação JWT
- [x] Integração Frontend + Backend
- [x] Gestão de perfil e configurações
- [x] Landing page moderna com carrossel
- [x] Regras de divisão financeira

### 🚧 Em Desenvolvimento
- [ ] CRUD completo de despesas
- [ ] CRUD de cartões de crédito
- [ ] CRUD de investimentos
- [ ] CRUD de metas
- [ ] Relatórios e analytics

### 🔮 Futuro
- [ ] Notificações push
- [ ] Importação de extratos bancários
- [ ] Integração Open Banking
- [ ] IA para categorização automática
- [ ] App mobile nativo
- [ ] Múltiplas moedas

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