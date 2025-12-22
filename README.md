# 💰 Clarity Cash - Controle Financeiro Inteligente

## 🚀 Recursos Implementados

### ✅ **Funcionalidades Principais**
- 📊 **Dashboard Intuitivo** com métricas em tempo real
- 💳 **Múltiplos Cartões** de crédito com controle individual
- 📱 **Parcelas Automáticas** para compras no cartão
- 🔄 **Contas Recorrentes** mensais
- 💰 **Receitas Extras** durante o mês
- 📅 **Navegação por Mês** com calendário
- 🌙 **Modo Escuro/Claro**
- ☁️ **Sincronização na Nuvem** com MongoDB

### 📈 **Relatórios e Analytics**
- 🥧 **Gráfico de Pizza** - Gastos por categoria
- 📊 **Gráfico de Barras** - Gastos por tipo (Essencial/Pessoal/Investimento)
- 📈 **Tendência Mensal** - Últimos 6 meses
- 💾 **Exportar Dados** em JSON
- 🎯 **Insights Inteligentes** - Gasto diário permitido

### 📱 **PWA (Progressive Web App)**
- 🔧 **Instalável** no celular/desktop
- ⚡ **Cache Offline** para uso sem internet
- 🔔 **Notificações** (preparado para futuras implementações)

## 🛠️ **Como Executar**

### **Desenvolvimento Local**
```bash
# Frontend
npm run dev

# Backend (em outro terminal)
cd server
npm start

# Ou usar o script automático
./start.sh
```

### **Deploy em Produção**

#### **Frontend (Vercel)**
1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente:
   ```
   VITE_API_URL=https://seu-backend.vercel.app
   ```
3. Deploy automático a cada push

#### **Backend (Railway/Render)**
1. Faça deploy da pasta `server/` 
2. Configure a variável:
   ```
   MONGODB_URI=sua-string-mongodb
   ```

## 🔧 **Configuração**

### **MongoDB**
1. Crie um cluster no [MongoDB Atlas](https://mongodb.com/atlas)
2. Configure as variáveis no `.env`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/clarity-cash
   VITE_API_URL=http://localhost:3001
   ```

## 📋 **Próximos Passos Sugeridos**

### **Curto Prazo** ⚡
- [ ] Autenticação com Google/Apple
- [ ] Notificações push
- [ ] Modo offline robusto
- [ ] Importar/exportar dados

### **Médio Prazo** 🎯
- [ ] Integração bancária (Open Banking)
- [ ] IA para categorização automática
- [ ] Metas de economia
- [ ] Planejamento financeiro

### **Longo Prazo** 🚀
- [ ] App nativo (React Native)
- [ ] Múltiplas moedas
- [ ] Consultoria financeira IA
- [ ] Marketplace financeiro

## 🏗️ **Arquitetura**

```
Frontend (React + TypeScript)
    ↓ HTTP Requests
Backend (Express.js + Node.js)
    ↓ MongoDB Driver
Database (MongoDB Atlas)
```

## 📱 **Como Instalar como App**

### **Android/iOS**
1. Abra no navegador
2. Menu → "Adicionar à tela inicial"
3. Use como app nativo!

### **Desktop**
1. Chrome: Ícone de instalação na barra de endereço
2. Edge: Menu → Apps → Instalar este site

---

**Desenvolvido com ❤️ para simplificar o controle financeiro pessoal**