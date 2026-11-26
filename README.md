# 🐾 Natal Mansão dos Cats 🎅🎄
### Portal Solidário de Natal, Apadrinhamento e Adoção de Gatinhos
**Guarujá / SP • ONG Mansão dos Cats**

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![Instagram](https://img.shields.io/badge/Instagram-@mansaodoscats-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/mansaodoscats/)

---

## 🌟 Sobre o Projeto

A **Mansão dos Cats** é uma ONG localizada no **Guarujá/SP**, dedicada ao resgate, tratamento veterinário, castração, acolhimento e encaminhamento para **adoção responsável** de gatos em situação de vulnerabilidade e abandono no litoral paulista.

Este portal foi desenvolvido para a campanha de fim de ano da instituição, permitindo que qualquer pessoa:
1. **Apadrinhe um gatinho** com um presente simbólico de Natal (sachê, ração ou areia) via **Pix**.
2. **Adote com amor e responsabilidade** (para lares 100% telados e seguros).
3. **Divulgue e compartilhe** a campanha nas redes sociais através de cards personalizados gerados para **Instagram Stories (9:16)**.

---

## ✨ Funcionalidades Principais

### 1. 🐱 Catálogo de Gatinhos & Mural de Padrinhos
- Cards detalhados com foto em alta resolução, idade, histórico de resgate, traços de personalidade e tags.
- **Selo de Adoção Responsável:** Direcionamento direto para o Instagram oficial da ONG ([@mansaodoscats](https://www.instagram.com/mansaodoscats/)) para entrevistas de adoção.
- **Mural de Padrinhos em Tempo Real:** Cada doador tem seu nome estampado no card do gatinho escolhido (`🎅 Amanda (Sachê 🥫)`), estimulando uma corrente solidária.
- **Sem limitador:** Os gatinhos podem acumular múltiplos presentes ao longo de toda a campanha.
- Filtros dinâmicos (*Todos*, *Precisando de Padrinho 🎁*, *Mais Apadrinhados ⭐*, *Filhotes 🍼*, *Especiais/Idosinhos 🌟*) e busca em tempo real.

### 2. 🎁 Fluxo de Doação via Pix em 3 Passos
- **Passo 1: Seleção do Presente:** Sachê Delícia (R$ 15), Areia Limpinha (R$ 25), Ração Crocante (R$ 35), Combo Noel Completo (R$ 75) ou Valor Livre.
- **Passo 2: Pagamento Pix:** QR Code gerado dinamicamente e código Pix Copia e Cola (padrão EMV BR Code) com botão de cópia em 1 clique.
  - **Chave Pix Oficial:** `padrinhogatos@gmail.com`
  - **Titular da Conta:** `FERNANDA GAGLIANO ALVES`
- **Passo 3: Envio do Comprovante:** Área drag-and-drop para anexar comprovante ou botão de envio direto com mensagem pré-formatada para o WhatsApp da Mansão.

### 3. 📸 Gerador Automático de Certificados (Instagram Stories 9:16)
- Desenhado via **HTML5 Canvas API** em alta resolução (1080x1920).
- Exibe o gatinho com gorro de Papai Noel, nome do padrinho, presente escolhido, sticker chamativo (`🔗 TOQUE NO LINK DO STORY!`) e dados oficiais da ONG.
- Botão com download instantâneo em arquivo `.png`.

### 4. 📢 Card Oficial de Apoio / Embaixador do Bem
- Mesmo quem não puder doar dinheiro pode se engajar como embaixador da campanha.
- A pessoa digita seu nome e ganha na hora um card personalizado:  
  > *"Eu, [Nome], apoio o Natal da Mansão dos Cats!"*
- Pronto para download e compartilhamento nos Stories ou WhatsApp.

### 5. 🔄 Sincronização em Tempo Real com Google Sheets
- Conectado diretamente à planilha oficial do Google Drive da ONG.
- As voluntárias podem cadastrar novos resgatadinhos pela planilha no celular ou computador, e o site atualiza automaticamente para todos os visitantes sem necessidade de novos deploys!
- Suporte a conversão automática de links do Google Drive e ImgBB para imagens diretas em alta definição.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica, acessibilidade e micro-interações.
- **CSS3:** Design responsivo mobile-first, variáveis CSS, gradientes natalinos, animações de neve suave e glassmorphism.
- **JavaScript (ES6+):** Lógica reativa, integração com Google Sheets CSV API, manipulação do DOM e persistência local (`localStorage`).
- **HTML5 Canvas API:** Renderização gráfica dos certificados e cards personalizados em 1080x1920.
- **Canvas-Confetti:** Animação festiva de confetes na confirmação do apadrinhamento.
- **QRCode.js:** Geração dinâmica de QR Codes de pagamento Pix.
- **Font Awesome 6 & Google Fonts (Fredoka & Nunito):** Tipografia acolhedora e iconografia temática.
- **Vercel:** Hospedagem em borda com alta disponibilidade, HTTPS gratuito e deploy contínuo integrado ao GitHub.

---

## 📁 Estrutura de Arquivos

```
natal-mansao-dos-cats/
├── assets/
│   ├── gatos/                   # Fotos dos gatinhos em alta resolução
│   ├── logo-mansao-dos-cats.jpg # Logo oficial da ONG
│   └── logo-base64.js           # Asset Base64 para renderização blindada do Canvas
├── index.html                   # Estrutura principal e modais do portal
├── style.css                    # Estilização visual completa e responsiva
├── script.js                    # Regras de negócio, Canvas e sincronização Google Sheets
├── gatos-modelo.csv             # Planilha modelo para importação de gatinhos
├── vercel.json                  # Configuração de rotas limpas para deploy na Vercel
└── README.md                    # Documentação do projeto
```

---

## 🚀 Como Executar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/amandaveloso/natal-mansao-dos-cats.git
```
2. Acesse a pasta do projeto:
```bash
cd natal-mansao-dos-cats
```
3. Abra o arquivo `index.html` em qualquer navegador ou execute com um servidor local:
```bash
# Com Node.js:
npx serve .

# Ou com Python:
python -m http.server 8080
```

---

## 🔒 Dados Oficiais da Campanha (Transparência)

- **Instituição:** Mansão dos Cats — Resgate e Proteção Animal
- **Localização:** Guarujá - SP (Atendimento na Baixada Santista)
- **Instagram Oficial:** [@mansaodoscats](https://www.instagram.com/mansaodoscats/)
- **Chave Pix Oficial (E-mail):** `padrinhogatos@gmail.com`
- **Titular da Conta:** `FERNANDA GAGLIANO ALVES`

---

*Desenvolvido com muito amor e carinho pelos gatinhos da Mansão dos Cats! 🐾❤️🎄*
