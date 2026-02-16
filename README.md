# 🎭 Cara de Meme - Meme Filter PWA

Uma Progressive Web App (PWA) portuguesa que deteta as tuas expressões faciais em tempo real e transforma-as em **memes virais portugueses e brasileiros**! 

## 🚀 Features (Fase 1 - MVP)

✅ **Detecção Facial em Tempo Real** - Usa MediaPipe para análise de expressões  
✅ **Interface Responsiva** - Funciona perfeitamente em desktop, tablet e mobile  
✅ **Zero Instalação** - Abre no browser, sem app store  
✅ **Privacidade** - Todo o processamento acontece no teu dispositivo  
✅ **Memes Portugueses** - Base de dados de memes virais PT/BR  

## 📦 Stack Tecnológico

- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Detecção:** MediaPipe Face Landmarker (Google AI)
- **Estilos:** Tailwind CSS
- **Deploy:** Vercel (gratuito)
- **State:** Zustand (opcional para próximas fases)

## 🛠️ Instalação Local

```bash
# Clone o repositório
git clone https://github.com/diogocarrola/cara-de-meme.git
cd cara-de-meme

# Instala dependências
npm install

# Executa em desenvolvimento
npm run dev

# Abre em http://localhost:3000
```

## 📱 Como Usar

1. **Abre a App:** Vai para https://cara-de-meme.vercel.app (em breve)
2. **Autoriza Câmara:** Clica em "Abrir Câmara" e autoriza
3. **Experimenta Expressões:** Faz diferentes caras e vê os memes correspondentes
4. **Grava e Partilha:** (Fase 4+) Grava um clip e partilha no Instagram/TikTok

## 🎯 Roadmap

### ✅ Fase 1: Prova de Conceito (MVP)
- [x] Setup Next.js + TypeScript
- [x] Integrar MediaPipe Face Landmarker
- [x] Componente CameraFeed
- [x] Expression Mapper
- [x] Meme Database
- [ ] Testar em dispositivos reais

### 📋 Fase 2: Memes + Gestos
- [ ] Expandir base de dados com 10-15 memes reais
- [ ] Integrar MediaPipe Hand Landmarker
- [ ] Detecção de gestos (mão no queixo, braços cruzados, etc.)
- [ ] Combinação face + mãos

### 🎬 Fase 3: Gravação de Vídeo
- [ ] MediaRecorder API
- [ ] Marca d'água com @instagram
- [ ] Download de vídeos gravados

### 📤 Fase 4: Partilha Social
- [ ] Botões de partilha (Instagram, TikTok, WhatsApp)
- [ ] Web Share API
- [ ] Analytics com GA4

### 🌐 Fase 5: PWA + Deploy
- [ ] Service Worker
- [ ] PWA Manifest
- [ ] Deploy no Vercel
- [ ] Otimizações de performance

## 🗂️ Estrutura de Projeto

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Tailwind styles
├── components/
│   ├── CameraFeed.tsx      # Stream da câmara
│   ├── MemeDisplay.tsx     # Exibe meme ativo
│   ├── Controls.tsx        # Botões de controlo
│   └── InfoModal.tsx       # Modal de instruções
├── hooks/
│   └── useMediaPipe.ts     # Custom hook para detecção
├── lib/
│   └── expressionMapper.ts # Lógica de matching
├── constants/
│   └── memeDatabase.ts     # Base de dados dos memes
└── public/
    └── memes/              # Imagens/vídeos dos memes
```

## 🎨 Memes Inclusos (Fase 1)

Placeholder memes - em breve com:
- 😕 Nazaré Confusa
- 🐕 Cachorro Fazendo Piada
- 🧑 Bruno Aleixo
- 💭 "Eu é que sei"
- ... e mais!

## 🚄 Performance

- **Face Detection:** ~20-30ms em mobile, ~10ms em desktop
- **Bundle Size:** <1MB (otimizado)
- **Modo Offline:** Service Worker cache (PWA)

## 📊 Analytics (Futura)

- Número de utilizadores
- Expressões mais detetadas
- Memes mais populares
- Taxa de downloads/shares

## 🔒 Privacidade

- ✅ Nenhum vídeo é enviado para servidores
- ✅ Processamento 100% no dispositivo
- ✅ Sem cookies de rastreamento
- ✅ Local storage apenas para preferências

## 📄 Licença

MIT - Vê [LICENSE](LICENSE) para detalhes

## 🤝 Contribuições

Adoras a ideia? Vê [CONTRIBUTING.md](CONTRIBUTING.md) para saber como contribuir!

## 🎯 Próximos Passos

1. **Phase 1 Complete:** Testar em diferentes dispositivos
2. **Recolher Feedback:** Community feedback nos primeiros testes
3. **Fase 2:** Adicionar mais memes reais
4. **Fase 3:** Gravação de vídeos
5. **Lançamento:** ProductHunt + Social Media

---

**Feito com ❤️ em Portugal | [GitHub](https://github.com/diogocarrola/cara-de-meme) | [@Instagram](https://instagram.com/diogocarrola)**

🚀 **Bora criar o meme do ano!**