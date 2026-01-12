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
- 💾 **Armazenamento Local** com localStorage

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
```

### **Deploy em Produção**

#### **Frontend (Vercel)**
1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente:
   ```
   VITE_API_URL=https://sua-api-java.com/api
   ```
3. Deploy automático a cada push

## 🔧 **Configuração**

### **API Java**
1. Configure a URL da API Java no `.env`:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```
2. Consulte `API_INTEGRATION.md` para detalhes dos endpoints

## 📋 **Estado Atual**

### **✅ Implementado**
- Interface completa do usuário
- Gerenciamento de dados local (localStorage)
- Todas as funcionalidades financeiras
- PWA funcional
- Estrutura preparada para API Java

### **⏳ Pendente**
- API Java backend
- Sistema de autenticação
- Sincronização na nuvem
- Integração com banco de dados

## 📋 **Próximos Passos**

### **Curto Prazo** ⚡
- [ ] Implementar API Java
- [ ] Reativar sistema de autenticação
- [ ] Sincronização com banco de dados
- [ ] Notificações push

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
    ↓ HTTP Requests (Preparado)
Java API (A ser implementado)
    ↓ JPA/Hibernate
Database (A ser definido)
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