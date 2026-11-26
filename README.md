# 🐾 Natal Mansão dos Cats 🎅🎄
### Portal da Campanha Solidária de Natal & Apadrinhamento de Gatinhos

Portal web desenvolvido para a campanha de Natal da ONG **Mansão dos Cats**, inspirado em campanhas de apadrinhamento de animais com foco em experiência mobile, facilidade de doação via Pix e viralização no Instagram Stories.

---

## ✨ Funcionalidades Principais

1. **Identidade Visual da Mansão dos Cats:**
   - Paleta oficial baseada no logo: Turquesa vibrante (`#24bdcf`), Laranja/Amarelo Mansão (`#f59e1b`), Vermelho Natalino (`#d9383a`) e detalhes aconchegantes.
   - Neve animada suave caindo na tela com patinhas e estrelas.
   - Logo oficial da Mansão dos Cats integrado no topo, hero e certificado.

2. **Catálogo de Gatinhos Interativo:**
   - Cards com foto, idade, tags de personalidade, biografia comovente e barra de progresso de presentes recebidos.
   - Filtros dinâmicos: *Todos*, *Aguardando Noel 🎁*, *Já Apadrinhados ❤️*, *Filhotes 🍼* e *Especiais / Idosinhos 🌟*.
   - Campo de busca em tempo real por nome ou traço de personalidade.

3. **Fluxo de Apadrinhamento em 3 Passos (Modal):**
   - **Passo 1: Presente Simbólico:**
     - 🥫 Sachê Delícia de Natal — R$ 15,00
     - 🏖️ Areia Higiênica Limpinha — R$ 25,00
     - 🥣 Pacote de Ração Crocante — R$ 35,00
     - 👑 Combo Noel Completo (Super Padrinho) — R$ 75,00
     - 💖 Outro Valor Livre (campo editável)
     - Campo para nome/apelido do padrinho e mensagem de carinho.
   - **Passo 2: Pagamento Pix:**
     - Chave Pix Oficial: `padrinhogatos@gmail.com`
     - QR Code gerado dinamicamente na tela.
     - Código Pix Copia e Cola completo com botão de cópia em 1 clique e feedback sonoro/visual.
   - **Passo 3: Envio de Comprovante:**
     - Área de upload com suporte a arrastar e soltar (drag & drop) ou selecionar arquivo (imagem ou PDF).
     - Pré-visualização instantânea do arquivo anexado.
     - Opção alternativa de envio direto para o WhatsApp da Mansão com mensagem pré-preenchida.

4. **Tela de Agradecimento & Gerador de Certificado para Instagram:**
   - Explosão festiva de confetes coloridos (`canvas-confetti`).
   - Balãozinho de fala com foto do gatinho agradecendo o padrinho pelo nome.
   - **Gerador automático de Card para Stories do Instagram (9:16 - 1080x1920):**
     - Desenhado via HTML5 Canvas em altíssima qualidade.
     - Contém logo da Mansão, moldura festiva, foto do gatinho com gorro de Papai Noel, nome do padrinho, presente escolhido e chave Pix para incentivar amigos a apadrinharem.
     - Botão **"Baixar Imagem para o Instagram"** (salva direto em PNG).
     - Botão **"Compartilhar no WhatsApp"** com texto pronto e link.
     - Botão **"Copiar Legenda Pronta"** com hashtags natalinas para colar no post.

---

## 🚀 Como Testar Localmente no seu Computador

Você pode abrir o projeto imediatamente:
1. Vá até a pasta `natal-mansao-dos-cats` no seu computador.
2. Dê um duplo clique no arquivo `index.html` para abrir diretamente em qualquer navegador (Chrome, Edge, Firefox, Safari).
3. *(Recomendado para testar o download do Canvas em navegadores com restrições locais de arquivo)*: Execute com uma extensão como **Live Server** no VS Code ou pelo terminal:
   ```bash
   npx serve .
   # ou
   python -m http.server 8080
   ```

---

## 📝 Como Cadastrar os Gatinhos Reais da Mansão

Para trocar os gatinhos testes pelos reais da ONG, abra o arquivo `script.js` e edite a lista `initialCatsData` no início do arquivo:

```javascript
{
  id: 1,
  name: "Nome do Gato",
  age: "2 anos",
  category: "aguardando", // "aguardando", "apadrinhado", "filhote" ou "especial"
  type: "adulto",         // "filhote", "adulto" ou "especial"
  tags: ["Dócil", "Carinhoso", "Castrado"],
  photo: "https://sua-foto-aqui.jpg", // ou caminho local ex: "assets/mingau.jpg"
  bio: "Historinha do gatinho aqui...",
  sponsorsCount: 0,
  sponsorsGoal: 3,
  status: "Aguardando Noel 🎁"
}
```

---

## 🌐 Como Subir no Vercel ou Netlify

### Opção 1: Vercel (Recomendado)
1. Instale a Vercel CLI ou acesse [vercel.com](https://vercel.com).
2. Arraste a pasta `natal-mansao-dos-cats` ou faça deploy via Git.
3. Como é um projeto estático com `vercel.json` pré-configurado, o deploy fica pronto em menos de 30 segundos com HTTPS gratuito!

### Opção 2: Netlify
1. Acesse [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arraste a pasta `natal-mansao-dos-cats`.
3. Pronto! O site estará online imediatamente.
