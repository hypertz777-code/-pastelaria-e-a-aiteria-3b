# 🥟 Sistema de Pedidos - Pastelaria & Açaí 🍇

Um sistema completo de gerenciamento de pedidos para pastelarias e açaiterias, desenvolvido em React com design moderno e cores atrativas.

## ✨ Funcionalidades

- **Garçom - Novo Pedido**: Interface para registrar novos pedidos de açaí e pastéis
- **Chef - Visualizar Pedidos**: Controle de estoque e gerenciamento de pedidos em andamento
- **Financeiro - Vendas**: Relatórios de vendas e histórico financeiro

## 🎨 Design

- Cores inspiradas em pastelaria e açaí
- Interface responsiva e moderna
- Animações suaves e micro-interações
- Emojis e ícones para melhor experiência visual

## 🚀 Como executar localmente

1. Instale as dependências:
```bash
npm install --legacy-peer-deps
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse http://localhost:5173

## 📦 Deploy no GitHub Pages

1. Faça o build do projeto:
```bash
npm run build
```

2. Configure o GitHub Pages para usar a pasta `dist` ou faça upload dos arquivos da pasta `dist` para o repositório

3. O projeto já está configurado com `base: './'` no `vite.config.js` para funcionar no GitHub Pages

## 🔧 Deploy no Render (Backend)

Este projeto é apenas frontend. Para adicionar um backend:

1. Crie uma API Flask ou Node.js
2. Configure CORS para permitir requisições do frontend
3. Atualize a variável `API_BASE_URL` no código para apontar para sua API
4. Faça deploy do backend no Render

## 📋 Tecnologias utilizadas

- React 19
- Vite 6
- Tailwind CSS 4
- Shadcn/ui
- Lucide React (ícones)
- Framer Motion (animações)

## 🎯 Compatibilidade

- ✅ GitHub Pages (frontend estático)
- ✅ Netlify, Vercel (frontend estático)
- ✅ Render (com backend separado)
- ✅ Responsivo (desktop e mobile)

## 🔄 Próximas melhorias

- Integração com backend real
- Sistema de autenticação
- Impressão de pedidos
- Notificações em tempo real
- Relatórios avançados

---

Desenvolvido com ❤️ para facilitar o gerenciamento de pastelarias e açaiterias!

