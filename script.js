/**
 * NATAL MANSÃO DOS CATS - GUARUJÁ/SP 🐾🎄
 * Chave Pix Oficial: padrinhogatos@gmail.com
 * Titular da Conta: FERNANDA GAGLIANO ALVES
 * Instagram: https://www.instagram.com/mansaodoscats/
 */

// =================================================================
// 1. DADOS DOS GATINHOS & CONEXÃO COM GOOGLE SHEETS EM TEMPO REAL
// =================================================================
// Planilha Oficial da Campanha:
const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/1vAGwYnNTb5Moai2OmlGK8pNMdQvZbxtlDKEPJ9Ly_2s/gviz/tq?tqx=out:csv";

// Helper de Higienização de Segurança (Prevenção contra XSS)
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Mapa de resolução direta para links de páginas do ImgBB (ibb.co -> i.ibb.co)
const IMGBB_DIRECT_MAP = {
  "5gFjLrcH": "https://i.ibb.co/W4tzfkKJ/Rosinha.png",
  "kVXK7c18": "https://i.ibb.co/gbJy2gVT/Oliver-e-Amora.png",
  "B5cDwPQk": "https://i.ibb.co/nN62R0Yp/Aurora.png",
  "7JpKWYV7": "https://i.ibb.co/KjsWq07C/Spike.png",
  "dw0gv41H": "https://i.ibb.co/MxD6HkWJ/Carol.png",
  "QFxhhsSD": "https://i.ibb.co/hRTrrpQY/Panda.png",
  "6cZp076d": "https://i.ibb.co/ZRJwzpyZ/Bruno-Mars.png"
};

// Helper para converter links do Google Drive e ImgBB para imagem direta com validação de protocolo
function formatPhotoUrl(url) {
  if (!url || typeof url !== "string") return "assets/logo-mansao-dos-cats.jpg";
  const trimmed = url.trim();
  if (!trimmed) return "assets/logo-mansao-dos-cats.jpg";

  // Prevenção contra injeção de esquemas maliciosos (javascript:, data:text/html, etc.)
  if (!/^https?:\/\/|^data:image\/|^assets\//i.test(trimmed)) {
    return "assets/logo-mansao-dos-cats.jpg";
  }

  // Se já for imagem direta i.ibb.co
  if (trimmed.includes("i.ibb.co")) {
    return trimmed;
  }

  // Se for link do ImgBB (ex: https://ibb.co/5gFjLrcH)
  const ibbMatch = trimmed.match(/ibb\.co\/([a-zA-Z0-9]+)/);
  if (ibbMatch && ibbMatch[1] && IMGBB_DIRECT_MAP[ibbMatch[1]]) {
    return IMGBB_DIRECT_MAP[ibbMatch[1]];
  }

  // Se for link do Google Drive (file/d/... ou id=...)
  const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`;
  }

  // Se for link do Dropbox
  if (trimmed.includes("dropbox.com")) {
    return trimmed.replace("dl=0", "raw=1");
  }
  return trimmed;
}

// Gatinhos Reais da Mansão dos Cats (vindos da Planilha Oficial)
const defaultCatsData = [
  {
    id: 1,
    name: "Rosinha",
    age: "3 anos",
    category: "aguardando",
    type: "adulto",
    tags: ["Carinhosa", "Gosta de Colo", "Aceita Pets"],
    photo: "https://i.ibb.co/W4tzfkKJ/Rosinha.png",
    bio: "Rosinha, essa doçura de gata! Castrada, aceita outros pets e ama um colinho e muito carinho.",
    sponsorsCount: 0,
    sponsors: []
  },
  {
    id: 2,
    name: "Oliver e Amora",
    age: "3 anos",
    category: "aguardando",
    type: "adulto",
    tags: ["Dupla de Irmãos", "Carinhosos", "Dóceis"],
    photo: "https://i.ibb.co/gbJy2gVT/Oliver-e-Amora.png",
    bio: "Dois gatinhos adultos cheios de amor e carinho, que vão encher o seu dia de alegria! Podem ser adotados juntos ou separados.",
    sponsorsCount: 0,
    sponsors: []
  },
  {
    id: 3,
    name: "Aurora",
    age: "Entre 4 e 6 anos",
    category: "aguardando",
    type: "adulto",
    tags: ["Calma", "Sossegada", "Companheira"],
    photo: "https://i.ibb.co/nN62R0Yp/Aurora.png",
    bio: "Aurora foi resgatada durante a desapropriação de Carapicuíba junto com seus 6 filhotes. Ela cuidou deles e agora espera a sua vez de ter um lar!",
    sponsorsCount: 0,
    sponsors: []
  },
  {
    id: 4,
    name: "Spike",
    age: "5 anos",
    category: "aguardando",
    type: "adulto",
    tags: ["Calmo", "Derrete de Carinho", "Fiv/Felv -"],
    photo: "https://i.ibb.co/KjsWq07C/Spike.png",
    bio: "Spike parece sério, mas quando ganha carinho se derrete como sorvete! Castrado, testado FIV/FELV negativos e pronto para ser o seu melhor amigo.",
    sponsorsCount: 0,
    sponsors: []
  },
  {
    id: 5,
    name: "Carol",
    age: "1 ano",
    category: "aguardando",
    type: "adulto",
    tags: ["Dócil", "Carinhosa", "Companheira"],
    photo: "https://i.ibb.co/MxD6HkWJ/Carol.png",
    bio: "Extremamente dócil, carinhosa e daquelas que adoram estar por perto oferecendo companhia. Já castrada e convive muito bem com outros pets.",
    sponsorsCount: 0,
    sponsors: []
  },
  {
    id: 6,
    name: "Panda",
    age: "1 ano",
    category: "aguardando",
    type: "adulto",
    tags: ["Tímida", "Doce", "Cheia de Afeto"],
    photo: "https://i.ibb.co/hRTrrpQY/Panda.png",
    bio: "Basta um pouco de carinho para descobrir uma gatinha doce e delicada. Castrada, FIV/FELV negativa e pronta para uma família amorosa.",
    sponsorsCount: 0,
    sponsors: []
  },
  {
    id: 7,
    name: "Bruno Mars",
    age: "1 ano e 8 meses",
    category: "aguardando",
    type: "adulto",
    tags: ["Lindo", "Dócil", "Fiv/Felv -"],
    photo: "https://i.ibb.co/ZRJwzpyZ/Bruno-Mars.png",
    bio: "Resgatado com apenas 10 dias em uma caixa de papelão. Hoje é um gatinho lindo, dócil, castrado e com exames FIV/FELV negativos.",
    sponsorsCount: 0,
    sponsors: []
  },
  {
    id: 8,
    name: "Norton",
    age: "3 anos",
    category: "aguardando",
    type: "adulto",
    tags: ["Amassa Pãozinho", "Curador", "Fiel"],
    photo: "assets/gatos/Norton.png",
    bio: "Amassa pãozinho na cabeça e pescoço, abraça e ronrona olhando nos olhos. Um companheiro incrível que prefere ser o filhote único da casa!",
    sponsorsCount: 0,
    sponsors: []
  }
];

// Limpeza de versões anteriores para começar com os gatos reais e contadores em zero
localStorage.removeItem("mansao_cats_data");
localStorage.removeItem("mansao_cats_data_v2");
localStorage.removeItem("mansao_cats_data_v3");
localStorage.removeItem("mansao_cats_data_v4");

// Carregar gatos do LocalStorage v5
let catsList = loadCatsData();

function loadCatsData() {
  const saved = localStorage.getItem("mansao_cats_data_v5");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(c => ({
        ...c,
        sponsors: Array.isArray(c.sponsors) ? c.sponsors : [],
        sponsorsCount: Array.isArray(c.sponsors) ? c.sponsors.length : (c.sponsorsCount || 0)
      }));
    } catch (e) {
      console.warn("Erro ao ler localStorage v5", e);
    }
  }
  return defaultCatsData;
}

function saveCatsData() {
  localStorage.setItem("mansao_cats_data_v5", JSON.stringify(catsList));
}

// Estado da Sessão Atual de Doação
let currentSponsorship = {
  cat: null,
  giftName: "Sachê Delícia de Natal",
  amount: 15.00,
  sponsorName: "",
  message: "",
  receiptFile: null,
  receiptPreviewUrl: null
};

// =================================================================
// 2. INICIALIZAÇÃO DA APLICAÇÃO & SINCRONIZAÇÃO EM TEMPO REAL
// =================================================================
document.addEventListener("DOMContentLoaded", () => {
  initSnow();
  renderCatsGrid(catsList);
  updateStats();
  setupEventListeners();
  setupQrCode();

  // Sincronizar automaticamente com a Planilha Google
  fetchCatsFromGoogleSheets();
});

// Sincronização automática com a Planilha Google da Mansão dos Cats
async function fetchCatsFromGoogleSheets() {
  if (!GOOGLE_SHEETS_CSV_URL) return;
  try {
    const res = await fetch(GOOGLE_SHEETS_CSV_URL);
    if (!res.ok) throw new Error("Status " + res.status);
    const text = await res.text();
    const parsed = parseCsvText(text);
    if (parsed && parsed.length > 0) {
      // Manter os padrinhos salvos pelo nome de cada gatinho
      const savedSponsors = JSON.parse(localStorage.getItem("mansao_cats_sponsors_map") || "{}");
      catsList = parsed.map(c => {
        const catKey = c.name.toLowerCase().trim();
        const catSponsors = savedSponsors[catKey] || [];
        return {
          ...c,
          sponsors: catSponsors,
          sponsorsCount: catSponsors.length
        };
      });
      saveCatsData();
      renderCatsGrid(catsList);
      updateStats();
      console.log(`✨ ${catsList.length} gatinhos sincronizados da Planilha Google da Mansão dos Cats!`);
    }
  } catch (err) {
    console.warn("Usando dados locais de gatinhos (offline ou fallback):", err);
  }
}

// Efeito de Neve Suave
function initSnow() {
  const container = document.getElementById("snow-container");
  if (!container) return;
  const snowflakesCount = window.innerWidth < 768 ? 20 : 40;
  const snowflakeChars = ["❄", "❅", "🐾", "•", "✨"];

  for (let i = 0; i < snowflakesCount; i++) {
    const flake = document.createElement("div");
    flake.className = "snowflake";
    flake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
    flake.style.left = `${Math.random() * 100}vw`;
    flake.style.animationDuration = `${5 + Math.random() * 8}s`;
    flake.style.animationDelay = `${Math.random() * 5}s`;
    flake.style.fontSize = `${0.6 + Math.random() * 1.1}rem`;
    flake.style.opacity = `${0.3 + Math.random() * 0.6}`;
    container.appendChild(flake);
  }
}

// Atualizar Contadores do Hero
function updateStats() {
  const totalEl = document.getElementById("stat-total-cats");
  const sponsoredEl = document.getElementById("stat-sponsored-cats");

  if (totalEl) totalEl.textContent = catsList.length;
  if (sponsoredEl) {
    const totalGifts = catsList.reduce((acc, cat) => acc + (cat.sponsorsCount || 0), 0);
    sponsoredEl.textContent = totalGifts;
  }
}

// Renderizar Grade de Gatinhos
function renderCatsGrid(list) {
  const grid = document.getElementById("cats-grid");
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px;">
        <i class="fa-solid fa-cat" style="font-size: 3rem; color: var(--primary-turquoise); margin-bottom: 15px;"></i>
        <h3 style="color: #124d56;">Nenhum gatinho encontrado com este filtro.</h3>
        <p style="color: #64748b;">Tente buscar por outro termo ou limpar os filtros!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(cat => {
    const giftsCount = cat.sponsorsCount || (cat.sponsors ? cat.sponsors.length : 0);
    const hasSponsors = cat.sponsors && cat.sponsors.length > 0;

    // Mural de Padrinhos (com escapeHtml para segurança)
    let sponsorsHtml = "";
    if (hasSponsors) {
      sponsorsHtml = `
        <div class="cat-sponsors-section">
          <span class="sponsors-label"><i class="fa-solid fa-heart" style="color: var(--festive-red);"></i> Padrinhos Noel:</span>
          <div class="sponsors-list-tags">
            ${cat.sponsors.map(s => `
              <span class="sponsor-chip" title="Presenteou com ${escapeHtml(s.gift)}">
                🎅 <strong>${escapeHtml(s.name)}</strong> <small>(${escapeHtml(s.gift)})</small>
              </span>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      sponsorsHtml = `
        <div class="cat-sponsors-section">
          <div class="sponsor-chip-empty">
            <span>✨ Seja o 1º Padrinho Noel do ${escapeHtml(cat.name)}!</span>
          </div>
        </div>
      `;
    }

    const safeName = escapeHtml(cat.name);
    const safeAge = escapeHtml(cat.age);
    const safeBio = escapeHtml(cat.bio);
    const safePhoto = escapeHtml(cat.photo);

    return `
      <article class="cat-card" data-cat-id="${cat.id}">
        <div class="cat-card-media">
          <img src="${safePhoto}" alt="${safeName}" class="cat-img" loading="lazy" onerror="this.src='assets/logo-mansao-dos-cats.jpg'">
          <span class="cat-status-badge aguardando">
            <i class="fa-solid fa-gift"></i> ${giftsCount > 0 ? `${giftsCount} presente${giftsCount > 1 ? 's' : ''} ganho${giftsCount > 1 ? 's' : ''}` : 'Aguardando Noel 🎁'}
          </span>
          <span class="cat-santa-hat-icon" title="Espírito de Natal">🎅</span>
        </div>

        <div class="cat-card-body">
          <div class="cat-title-row">
            <h3 class="cat-name">${safeName}</h3>
            <span class="cat-age">${safeAge}</span>
          </div>

          <div class="cat-tags">
            ${cat.tags.map(t => `<span class="cat-tag">${escapeHtml(t)}</span>`).join('')}
          </div>

          <p class="cat-bio">${safeBio}</p>

          <button class="btn-sponsor-cat" onclick="openSponsorModal(${cat.id})" style="margin-bottom: 14px;">
            <i class="fa-solid fa-gift"></i> Apadrinhar ${safeName}
          </button>

          <div class="cat-gifts-badge">
            <i class="fa-solid fa-wand-magic-sparkles"></i> 
            <span>${giftsCount === 0 ? 'Esperando o primeiro carinho de Natal!' : `${giftsCount} presente${giftsCount > 1 ? 's' : ''} garantido${giftsCount > 1 ? 's' : ''}! Continue doando ❤️`}</span>
          </div>

          ${sponsorsHtml}

          <!-- Chamada de Adoção Responsável -->
          <div class="cat-adoption-callout" style="margin-top: 6px; margin-bottom: 0;">
            <span><i class="fa-solid fa-house-chimney-heart"></i> <strong>Disponível para Adoção!</strong></span>
            <span>Mora no Guarujá ou região e quer me adotar?</span>
            <a href="https://www.instagram.com/mansaodoscats/" target="_blank" rel="noopener noreferrer" class="link-adopt">
              Mande uma mensagem no @mansaodoscats 🐾
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// =================================================================
// 3. FILTROS E BUSCA
// =================================================================
function setupEventListeners() {
  // Busca em tempo real
  const searchInput = document.getElementById("cat-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      const filtered = catsList.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.tags.some(t => t.toLowerCase().includes(term)) ||
        c.bio.toLowerCase().includes(term) ||
        (c.sponsors && c.sponsors.some(s => s.name.toLowerCase().includes(term)))
      );
      renderCatsGrid(filtered);
    });
  }

  // Pílulas de Filtros
  const filterPills = document.querySelectorAll(".filter-pills .pill");
  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      if (pill.classList.contains("pill-import")) return; // Botão de importação
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const filter = pill.getAttribute("data-filter");

      if (filter === "all") {
        renderCatsGrid(catsList);
      } else if (filter === "precisando") {
        renderCatsGrid(catsList.filter(c => (c.sponsorsCount || 0) <= 0));
      } else if (filter === "apadrinhados") {
        renderCatsGrid(catsList.filter(c => (c.sponsorsCount || 0) >= 1));
      } else if (filter === "filhote") {
        renderCatsGrid(catsList.filter(c => c.type === "filhote"));
      } else if (filter === "especial") {
        renderCatsGrid(catsList.filter(c => c.type === "especial"));
      }
    });
  });

  // Modal Close buttons
  document.getElementById("modal-close-btn")?.addEventListener("click", closeSponsorModal);
  document.getElementById("success-modal-close")?.addEventListener("click", closeSuccessModal);

  // Fechar ao clicar fora
  window.addEventListener("click", (e) => {
    const sponsorModal = document.getElementById("sponsor-modal");
    const successModal = document.getElementById("success-modal");
    const shareModal = document.getElementById("share-campaign-modal");
    const adminModal = document.getElementById("admin-modal");
    const receiptPreviewModal = document.getElementById("receipt-preview-modal");
    if (e.target === sponsorModal) closeSponsorModal();
    if (e.target === successModal) closeSuccessModal();
    if (e.target === shareModal) closeShareCampaignModal();
    if (e.target === adminModal) closeAdminModal();
    if (e.target === receiptPreviewModal) closeReceiptPreviewModal();
  });

  // Radios de Presentes
  const giftRadios = document.querySelectorAll("input[name='gift-option']");
  const customInput = document.getElementById("custom-amount-input");

  giftRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      const card = e.target.closest(".gift-radio-card");
      if (radio.value === "custom") {
        customInput.removeAttribute("disabled");
        customInput.focus();
        currentSponsorship.amount = parseFloat(customInput.value) || 50;
        currentSponsorship.giftName = "Presente de Coração";
      } else {
        customInput.setAttribute("disabled", "true");
        currentSponsorship.amount = parseFloat(radio.value);
        currentSponsorship.giftName = card.getAttribute("data-name");
      }
    });
  });

  if (customInput) {
    customInput.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value) || 5;
      currentSponsorship.amount = val;
    });
  }

  // Navegação do Fluxo (Steps)
  document.getElementById("btn-goto-step-2")?.addEventListener("click", goToStep2);
  document.getElementById("btn-backto-step-1")?.addEventListener("click", () => switchStep(1));
  document.getElementById("btn-goto-step-3")?.addEventListener("click", () => switchStep(3));
  document.getElementById("btn-backto-step-2")?.addEventListener("click", () => switchStep(2));
  document.getElementById("btn-finish-sponsorship")?.addEventListener("click", finishSponsorship);

  // Copiar Chave Pix
  document.getElementById("btn-copy-key")?.addEventListener("click", () => {
    copyText("padrinhogatos@gmail.com", document.getElementById("btn-copy-key"));
  });

  // Copiar Código Copia e Cola
  document.getElementById("btn-copy-copiacola")?.addEventListener("click", () => {
    const textarea = document.getElementById("pix-copia-cola-textarea");
    if (textarea) {
      copyText(textarea.value, document.getElementById("btn-copy-copiacola"));
    }
  });

  // Dropzone de Comprovante
  setupDropzone();

  // Ações do Modal de Sucesso
  document.getElementById("btn-download-cert")?.addEventListener("click", downloadCertificate);
  document.getElementById("btn-copy-caption")?.addEventListener("click", copyInstagramCaption);
  document.getElementById("btn-sponsor-another")?.addEventListener("click", () => {
    closeSuccessModal();
    const gatinhosSection = document.getElementById("gatinhos");
    if (gatinhosSection) gatinhosSection.scrollIntoView({ behavior: "smooth" });
  });
}

// =================================================================
// 4. FLUXO DO MODAL DE APADRINHAMENTO
// =================================================================
function openSponsorModal(catId) {
  const cat = catsList.find(c => c.id === catId);
  if (!cat) return;

  currentSponsorship.cat = cat;
  currentSponsorship.receiptFile = null;
  currentSponsorship.receiptPreviewUrl = null;

  // Atualizar Mini Header do Modal
  document.getElementById("modal-cat-photo").src = cat.photo;
  document.getElementById("modal-cat-name").textContent = cat.name;
  document.getElementById("modal-cat-tags").textContent = `${cat.age} • ${cat.tags.join(" • ")}`;

  // Resetar passos e abrir
  switchStep(1);
  const modal = document.getElementById("sponsor-modal");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeSponsorModal() {
  const modal = document.getElementById("sponsor-modal");
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

function switchStep(stepNumber) {
  document.querySelectorAll(".step-screen").forEach(s => s.classList.remove("active"));
  document.getElementById(`screen-step-${stepNumber}`)?.classList.add("active");

  for (let i = 1; i <= 3; i++) {
    const indicator = document.getElementById(`indicator-step-${i}`);
    if (indicator) {
      indicator.classList.remove("active", "completed");
      if (i < stepNumber) indicator.classList.add("completed");
      if (i === stepNumber) indicator.classList.add("active");
    }
  }
}

function goToStep2() {
  const nameInput = document.getElementById("sponsor-name-input");
  const msgInput = document.getElementById("sponsor-message-input");

  currentSponsorship.sponsorName = nameInput.value.trim() || "Padrinho Noel Anônimo";
  currentSponsorship.message = msgInput.value.trim();

  document.getElementById("pix-summary-gift").textContent = currentSponsorship.giftName;
  document.getElementById("pix-summary-val").textContent = `R$ ${currentSponsorship.amount.toFixed(2).replace('.', ',')}`;

  generatePixPayload(currentSponsorship.amount, `MansaoCats-${currentSponsorship.cat.name}`);
  switchStep(2);
}

// Geração de Código Pix Copia e Cola Padrão BR Code (EMV)
function generatePixPayload(amount, txid = "MANSAOCATS") {
  const pixKey = "padrinhogatos@gmail.com";
  const merchantName = "FERNANDA GAGLIANO ALVES";
  const merchantCity = "GUARUJA";
  const formattedAmount = amount.toFixed(2);

  function formatField(id, value) {
    const len = value.length.toString().padStart(2, "0");
    return `${id}${len}${value}`;
  }

  const gui = formatField("00", "br.gov.bcb.pix");
  const keyField = formatField("01", pixKey);
  const accountInfo = formatField("26", `${gui}${keyField}`);

  const catCode = formatField("52", "0000");
  const currency = formatField("53", "986"); // BRL
  const amountField = formatField("54", formattedAmount);
  const country = formatField("58", "BR");
  const nameField = formatField("59", merchantName.substring(0, 25));
  const cityField = formatField("60", merchantCity);
  
  const txidField = formatField("05", txid.replace(/[^A-Za-z0-9]/g, "").substring(0, 20) || "NATAL");
  const addData = formatField("62", txidField);

  let payloadWithoutCrc = `000201${accountInfo}${catCode}${currency}${amountField}${country}${nameField}${cityField}${addData}6304`;
  const crc = computeCrc16(payloadWithoutCrc);
  const finalPixPayload = `${payloadWithoutCrc}${crc}`;

  const textarea = document.getElementById("pix-copia-cola-textarea");
  if (textarea) textarea.value = finalPixPayload;

  renderQrCode(finalPixPayload);
}

function computeCrc16(str) {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

let qrcodeInstance = null;
function setupQrCode() {
  const container = document.getElementById("qrcode-display");
  if (!container || typeof QRCode === "undefined") return;
  qrcodeInstance = new QRCode(container, {
    text: "padrinhogatos@gmail.com",
    width: 170,
    height: 170,
    colorDark: "#114c55",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}

function renderQrCode(text) {
  if (qrcodeInstance) {
    qrcodeInstance.clear();
    qrcodeInstance.makeCode(text);
  } else {
    setupQrCode();
    if (qrcodeInstance) qrcodeInstance.makeCode(text);
  }
}

// =================================================================
// 5. UPLOAD DE COMPROVANTE & FINALIZAÇÃO
// =================================================================
function setupDropzone() {
  const dropzone = document.getElementById("receipt-dropzone");
  const fileInput = document.getElementById("receipt-file-input");
  const idle = document.getElementById("dropzone-idle");
  const preview = document.getElementById("dropzone-preview");
  const previewImg = document.getElementById("preview-image");
  const previewPdf = document.getElementById("preview-pdf-icon");
  const previewFilename = document.getElementById("preview-filename");
  const removeBtn = document.getElementById("btn-remove-file");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentSponsorship.receiptFile = null;
    currentSponsorship.receiptPreviewUrl = null;
    fileInput.value = "";
    preview.classList.add("hidden");
    idle.classList.remove("hidden");
  });

  function handleFile(file) {
    if (!file) return;

    // Varredura de Segurança: Validar tamanho (máx 10MB) e formato permitido
    const maxSizeBytes = 10 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/pdf"];

    if (file.size > maxSizeBytes) {
      alert("O arquivo do comprovante é muito grande. Envie um arquivo de até 10MB.");
      return;
    }

    if (file.type && !allowedTypes.includes(file.type.toLowerCase())) {
      alert("Formato de arquivo não suportado. Por favor, envie uma foto (JPG, PNG) ou documento PDF.");
      return;
    }

    currentSponsorship.receiptFile = file;
    previewFilename.textContent = escapeHtml(file.name);
    idle.classList.add("hidden");
    preview.classList.remove("hidden");

    if (file.type && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        currentSponsorship.receiptPreviewUrl = event.target.result;
        previewImg.src = event.target.result;
        previewImg.classList.remove("hidden");
        previewPdf.classList.add("hidden");
      };
      reader.readAsDataURL(file);
    } else {
      previewImg.classList.add("hidden");
      previewPdf.classList.remove("hidden");
    }

    showToast("Comprovante anexado com sucesso! 🐾");
  }
}

function finishSponsorship() {
  const cat = currentSponsorship.cat;
  if (cat) {
    if (!Array.isArray(cat.sponsors)) cat.sponsors = [];
    cat.sponsors.unshift({
      name: currentSponsorship.sponsorName,
      gift: currentSponsorship.giftName
    });
    cat.sponsorsCount = cat.sponsors.length;

    // Preservar padrinhos associados ao nome do gatinho
    const savedSponsors = JSON.parse(localStorage.getItem("mansao_cats_sponsors_map") || "{}");
    savedSponsors[cat.name.toLowerCase().trim()] = cat.sponsors;
    localStorage.setItem("mansao_cats_sponsors_map", JSON.stringify(savedSponsors));

    saveCatsData();
    renderCatsGrid(catsList);
    updateStats();
  }

  // Registrar histórico da doação para a Área da Mansão (Comprovantes)
  const donationRecord = {
    id: "don_" + Date.now(),
    date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    catName: cat ? cat.name : "Gatinho",
    sponsorName: currentSponsorship.sponsorName || "Padrinho Noel Anônimo",
    amount: currentSponsorship.amount || 15,
    giftName: currentSponsorship.giftName || "Presente de Natal",
    message: currentSponsorship.message || "",
    hasReceipt: !!(currentSponsorship.receiptPreviewUrl || currentSponsorship.receiptFile),
    receiptPreview: currentSponsorship.receiptPreviewUrl || null,
    receiptName: currentSponsorship.receiptFile ? currentSponsorship.receiptFile.name : (currentSponsorship.receiptPreviewUrl ? "comprovante.png" : null)
  };

  try {
    const log = JSON.parse(localStorage.getItem("mansao_donations_log") || "[]");
    log.unshift(donationRecord);
    if (log.length > 50) log.pop();
    localStorage.setItem("mansao_donations_log", JSON.stringify(log));
  } catch (err) {
    console.warn("Storage quota fallback:", err);
    donationRecord.receiptPreview = null;
    const log = JSON.parse(localStorage.getItem("mansao_donations_log") || "[]");
    log.unshift(donationRecord);
    localStorage.setItem("mansao_donations_log", JSON.stringify(log));
  }

  closeSponsorModal();
  openSuccessModal();
}

// =================================================================
// 6. MODAL DE SUCESSO & GERAÇÃO ROBUSTA DE CERTIFICADO COM CTA
// =================================================================
function openSuccessModal() {
  const modal = document.getElementById("success-modal");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  if (typeof confetti === "function") {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#24bdcf", "#f59e1b", "#d9383a", "#ffffff"]
    });
  }

  document.getElementById("thankyou-cat-photo").src = currentSponsorship.cat.photo;
  document.getElementById("thankyou-cat-name").textContent = currentSponsorship.cat.name;
  document.getElementById("thankyou-sponsor-name").textContent = currentSponsorship.sponsorName;
  document.getElementById("thankyou-gift-name").textContent = currentSponsorship.giftName;

  renderCertificateCanvas();
}

function closeSuccessModal() {
  const modal = document.getElementById("success-modal");
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

/**
 * Renderiza o Certificado para Instagram Stories (1080x1920)
 * Inclui:
 * - Foto / Ilustração do Gatinho com Gorro de Noel
 * - Nome do Padrinho e do Gatinho
 * - Presente
 * - Titular do Pix: FERNANDA GAGLIANO ALVES
 * - Sticker simulado de Link do Instagram
 * - QR Code dinâmico no canto para quem ver a imagem poder escanear!
 */
function renderCertificateCanvas(forceFallbackCat = false) {
  const canvas = document.getElementById("certificate-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = 1080;
  const H = 1920;

  canvas.width = W;
  canvas.height = H;

  // 1. Fundo Gradiente Turquesa Mansão dos Cats
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, "#1aa3b3");
  bgGrad.addColorStop(0.3, "#27c4d6");
  bgGrad.addColorStop(0.75, "#6ce0ec");
  bgGrad.addColorStop(1, "#f3fcfd");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Pontinhos e Estrelas de Neve Suaves no Fundo
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  for (let i = 0; i < 65; i++) {
    const rx = (i * 127) % W;
    const ry = (i * 251) % H;
    const rSize = 3 + (i % 5);
    ctx.beginPath();
    ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Moldura Externa Dupla (Branca + Dourada)
  const margin = 45;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 6;
  roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, 40);
  ctx.stroke();

  ctx.strokeStyle = "rgba(245, 166, 35, 0.4)";
  ctx.lineWidth = 2;
  roundRect(ctx, margin + 14, margin + 14, W - (margin + 14) * 2, H - (margin + 14) * 2, 32);
  ctx.stroke();

  // 4. Cabeçalho de Textos
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px 'Fredoka', cursive, sans-serif";
  ctx.fillText("MANSÃO DOS CATS • GUARUJÁ/SP", W / 2, 280);

  ctx.fillStyle = "#fff4bd";
  ctx.font = "bold 32px 'Nunito', sans-serif";
  ctx.fillText("🐾 CAMPANHA SOLIDÁRIA DE NATAL 🎄", W / 2, 335);

  // 5. Faixa Dourada com Título Oficial
  drawBanner(ctx, W / 2, 395, 860, 90, "#f5a623");
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px 'Fredoka', cursive, sans-serif";
  ctx.fillText("CERTIFICADO DE PADRINHO NOEL", W / 2, 458);

  // 6. Textos do Gatinho e Padrinho
  ctx.fillStyle = "#0c3f47";
  ctx.font = "bold 38px 'Nunito', sans-serif";
  ctx.fillText("Eu apadrinhei com muito amor o(a):", W / 2, 1100);

  // Nome do Gatinho em Destaque Festivo
  ctx.fillStyle = "#d9383a";
  ctx.font = "bold 76px 'Fredoka', cursive, sans-serif";
  ctx.fillText(`✨ ${currentSponsorship.cat.name} ✨`, W / 2, 1185);

  // Card do Presente
  drawCardBox(ctx, W / 2 - 380, 1230, 760, 90, "rgba(255, 255, 255, 0.95)", "#24bdcf");
  ctx.fillStyle = "#124d56";
  ctx.font = "bold 34px 'Nunito', sans-serif";
  ctx.fillText(`Presente: ${currentSponsorship.giftName} 🎁`, W / 2, 1288);

  // Padrinho Nome
  ctx.fillStyle = "#0c3b42";
  ctx.font = "bold 36px 'Nunito', sans-serif";
  ctx.fillText("Padrinho(a) Oficial:", W / 2, 1375);

  ctx.fillStyle = "#b85d19";
  ctx.font = "bold 52px 'Fredoka', cursive, sans-serif";
  ctx.fillText(`❤️ ${currentSponsorship.sponsorName} ❤️`, W / 2, 1435);

  // 7. Sticker de Toque no Link dos Stories (Chama muita atenção!)
  drawStickerLink(ctx, W / 2, 1500, 520, 60);

  // 8. Bloco de CTA e Chave Pix
  drawCardBox(ctx, 80, 1580, W - 160, 240, "#ffffff", "#f5a623");

  ctx.fillStyle = "#d9383a";
  ctx.font = "bold 36px 'Fredoka', cursive, sans-serif";
  ctx.fillText("Faça o Natal de um gatinho feliz você também!", W / 2, 1638);

  ctx.fillStyle = "#334155";
  ctx.font = "bold 28px 'Nunito', sans-serif";
  ctx.fillText("Chave Pix E-mail: padrinhogatos@gmail.com", W / 2, 1685);

  ctx.fillStyle = "#126b77";
  ctx.font = "bold 28px 'Nunito', sans-serif";
  ctx.fillText("Titular: FERNANDA GAGLIANO ALVES", W / 2, 1730);

  ctx.fillStyle = "#475569";
  ctx.font = "600 24px 'Nunito', sans-serif";
  ctx.fillText("Apadrinhe com sachê (R$ 15), ração ou areia! 🥫🥣", W / 2, 1775);

  // Rodapé
  ctx.fillStyle = "rgba(13, 67, 74, 0.85)";
  ctx.font = "bold 26px 'Nunito', sans-serif";
  ctx.fillText("Link na Bio: @mansaodoscats • Guarujá/SP • #Adote", W / 2, 1865);

  // 9. Desenhar Logo da Mansão
  drawLogoOnCanvas(ctx, W / 2, 150, 125);

  // 10. Desenhar Foto do Gatinho
  const catCenterX = W / 2;
  const catCenterY = 780;
  const catRadius = 210;

  if (forceFallbackCat) {
    drawVectorCatAvatar(ctx, catCenterX, catCenterY, catRadius, currentSponsorship.cat.name);
  } else {
    drawCatPhotoWithFallback(ctx, catCenterX, catCenterY, catRadius, currentSponsorship.cat.photo, currentSponsorship.cat.name);
  }
}

// Sticker estilo Instagram Stories
function drawStickerLink(ctx, cx, cy, w, h) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#e11d48";
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(225, 29, 72, 0.25)";
  ctx.shadowBlur = 10;
  roundRect(ctx, x, y, w, h, 30);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#e11d48";
  ctx.font = "bold 26px 'Nunito', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🔗 TOQUE NO LINK DO STORY!", cx, cy + 9);
  ctx.restore();
}

function drawLogoOnCanvas(ctx, cx, cy, size) {
  const logoSrc = (typeof MANSAO_LOGO_BASE64 !== "undefined" && MANSAO_LOGO_BASE64) ? MANSAO_LOGO_BASE64 : "assets/logo-mansao-dos-cats.jpg";
  const logoImg = new Image();
  logoImg.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logoImg, cx - size / 2, cy - size / 2, size, size);
    ctx.restore();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.stroke();
  };
  logoImg.src = logoSrc;
}

function drawCatPhotoWithFallback(ctx, cx, cy, radius, photoUrl, catName) {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 25;
  ctx.shadowOffsetY = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();

  const catImg = new Image();
  if (!photoUrl.startsWith("data:") && !window.location.protocol.startsWith("file:")) {
    catImg.crossOrigin = "anonymous";
  }

  catImg.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 6, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(catImg, cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "95px sans-serif";
    ctx.fillText("🎅", cx - radius + 50, cy - radius + 70);
  };

  catImg.onerror = () => {
    drawVectorCatAvatar(ctx, cx, cy, radius, catName);
  };

  catImg.src = photoUrl;
}

function drawVectorCatAvatar(ctx, cx, cy, radius, catName) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 6, 0, Math.PI * 2);
  ctx.fillStyle = "#fff8e7";
  ctx.fill();

  ctx.fillStyle = "#f5a623";
  ctx.beginPath();
  ctx.arc(cx, cy + 30, radius * 0.65, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx - 110, cy - 40);
  ctx.lineTo(cx - 50, cy - 120);
  ctx.lineTo(cx - 10, cy - 40);
  ctx.fillStyle = "#f5a623";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + 10, cy - 40);
  ctx.lineTo(cx + 50, cy - 120);
  ctx.lineTo(cx + 110, cy - 40);
  ctx.fillStyle = "#f5a623";
  ctx.fill();

  ctx.fillStyle = "#fbb6ce";
  ctx.beginPath();
  ctx.moveTo(cx - 95, cy - 40);
  ctx.lineTo(cx - 50, cy - 100);
  ctx.lineTo(cx - 25, cy - 40);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + 25, cy - 40);
  ctx.lineTo(cx + 50, cy - 100);
  ctx.lineTo(cx + 95, cy - 40);
  ctx.fill();

  ctx.strokeStyle = "#4a5568";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx - 45, cy + 15, 18, 0.8 * Math.PI, 0.2 * Math.PI, true);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx + 45, cy + 15, 18, 0.8 * Math.PI, 0.2 * Math.PI, true);
  ctx.stroke();

  ctx.fillStyle = "#f472b6";
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy + 35);
  ctx.lineTo(cx + 12, cy + 35);
  ctx.lineTo(cx, cy + 48);
  ctx.fill();

  ctx.strokeStyle = "#718096";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy + 40); ctx.lineTo(cx - 90, cy + 32);
  ctx.moveTo(cx - 30, cy + 48); ctx.lineTo(cx - 95, cy + 50);
  ctx.moveTo(cx + 30, cy + 40); ctx.lineTo(cx + 90, cy + 32);
  ctx.moveTo(cx + 30, cy + 48); ctx.lineTo(cx + 95, cy + 50);
  ctx.stroke();

  ctx.restore();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = "95px sans-serif";
  ctx.fillText("🎅", cx - radius + 50, cy - radius + 70);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawBanner(ctx, cx, y, w, h, bgColor) {
  const x = cx - w / 2;
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, x, y, w, h, 24);
  ctx.fill();
  ctx.restore();
}

function drawCardBox(ctx, x, y, w, h, bgColor, borderColor) {
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.shadowColor = "rgba(0,0,0,0.12)";
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 8;
  roundRect(ctx, x, y, w, h, 24);
  ctx.fill();

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 4;
  roundRect(ctx, x, y, w, h, 24);
  ctx.stroke();
  ctx.restore();
}

// =================================================================
// 7. COMPARTILHAMENTO E DOWNLOAD
// =================================================================
function downloadCertificate() {
  const canvas = document.getElementById("certificate-canvas");
  if (!canvas) return;

  const catName = currentSponsorship.cat ? currentSponsorship.cat.name : "Gatinho";

  try {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Certificado_Padrinho_Noel_${catName}.png`;
    link.href = dataUrl;
    link.click();
    showToast("Download iniciado! Agora é só postar nos Stories! 📸");
  } catch (err) {
    console.warn("Canvas com restrição de CORS, redesenhando com avatar seguro...", err);
    renderCertificateCanvas(true);
    setTimeout(() => {
      try {
        const safeUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `Certificado_Padrinho_Noel_${catName}.png`;
        link.href = safeUrl;
        link.click();
        showToast("Certificado baixado com sucesso! 🐾");
      } catch (err2) {
        showToast("Dica: No Vercel/Netlify o download funciona 100% com a foto original! 🚀");
      }
    }, 100);
  }
}

function copyInstagramCaption() {
  const catName = currentSponsorship.cat ? currentSponsorship.cat.name : "um gatinho";
  const caption = 
    `🎄 Neste Natal, me tornei o Padrinho Noel do(a) ${catName} da @mansaodoscats (Guarujá/SP)! 🐾🎅\n\n` +
    `Os gatinhos resgatados precisam muito do nosso carinho, sachês e ração para terem um fim de ano cheio de amor e dignidade. ❤️\n\n` +
    `Faça como eu: escolha um gatinho para apadrinhar! Chave Pix: padrinhogatos@gmail.com (Titular: FERNANDA GAGLIANO ALVES) 🎁\n\n` +
    `#MansaoDosCats #Guaruja #NatalPet #ApadrinheUmGatinho #AdoteNaoCompre #GatosDoInstagram`;

  copyText(caption, document.getElementById("btn-copy-caption"));
}

// =================================================================
// 8. MODAL DE DIVULGAÇÃO GERAL DA CAMPANHA (CARD PERSONALIZADO)
// =================================================================
function openShareCampaignModal() {
  const modal = document.getElementById("share-campaign-modal");
  modal?.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // Inicializar o card personalizado com o nome atual ou placeholder
  const input = document.getElementById("supporter-name-input");
  if (input && !input.value.trim() && currentSponsorship.sponsorName) {
    input.value = currentSponsorship.sponsorName;
  }
  
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => renderSupporterCardCanvas());
  } else {
    renderSupporterCardCanvas();
  }
}

function closeShareCampaignModal() {
  const modal = document.getElementById("share-campaign-modal");
  modal?.classList.add("hidden");
  document.body.style.overflow = "auto";
}

/**
 * Renderiza o Card de Apoio Personalizado no Canvas (1080x1920)
 * "Eu, [Nome], apoio o Natal da Mansão dos Cats!"
 */
function renderSupporterCardCanvas() {
  const canvas = document.getElementById("supporter-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = 1080;
  const H = 1920;

  canvas.width = W;
  canvas.height = H;

  const rawName = document.getElementById("supporter-name-input")?.value.trim();
  const supporterName = rawName || "Amigo(a) dos Cats";

  // 1. Fundo Gradiente Turquesa Mansão dos Cats
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, "#1495a4");
  bgGrad.addColorStop(0.32, "#23c1d4");
  bgGrad.addColorStop(0.78, "#68dbe8");
  bgGrad.addColorStop(1, "#f3fcfd");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Neve e Brilhos Suaves no Fundo
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  for (let i = 0; i < 70; i++) {
    const rx = (i * 139) % W;
    const ry = (i * 269) % H;
    const rSize = 3 + (i % 5);
    ctx.beginPath();
    ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Moldura Externa Dupla (Branca + Dourada)
  const margin = 45;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 6;
  roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, 40);
  ctx.stroke();

  ctx.strokeStyle = "rgba(245, 166, 35, 0.45)";
  ctx.lineWidth = 2;
  roundRect(ctx, margin + 14, margin + 14, W - (margin + 14) * 2, H - (margin + 14) * 2, 32);
  ctx.stroke();

  // 4. Cabeçalho de Textos
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px 'Fredoka', cursive, sans-serif";
  ctx.fillText("MANSÃO DOS CATS • GUARUJÁ/SP", W / 2, 280);

  ctx.fillStyle = "#fff4bd";
  ctx.font = "bold 30px 'Nunito', sans-serif";
  ctx.fillText("🐾 CAMPANHA SOLIDÁRIA DE NATAL 🎄", W / 2, 335);

  // 5. Faixa Dourada Oficial de Apoio - Perfeitamente centralizada e proporcional
  const bannerY = 385;
  const bannerH = 86;
  drawBanner(ctx, W / 2, bannerY, 860, bannerH, "#f5a623");

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 38px 'Fredoka', cursive, sans-serif";
  ctx.fillText("EU APOIO O NATAL DOS CATS! 🐾❤️", W / 2, bannerY + bannerH / 2);
  ctx.restore();

  // 6. Ilustração Central Fofa de Gatinho Natalino da Mansão
  const catCenterX = W / 2;
  const catCenterY = 730;
  const catRadius = 195;
  drawVectorCatAvatar(ctx, catCenterX, catCenterY, catRadius, "Mansão");

  // 7. Texto Personalizado do Apoiador com Alinhamento e Espaçamento Impecáveis
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#0c3f47";
  ctx.font = "bold 34px 'Nunito', sans-serif";
  ctx.fillText("Eu,", W / 2, 985);

  // Nome do Apoiador com auto-ajuste de tamanho (evita estourar a tela se o nome for grande)
  let nameFontSize = 64;
  ctx.font = `bold ${nameFontSize}px 'Fredoka', cursive, sans-serif`;
  while (ctx.measureText(`✨ ${supporterName} ✨`).width > 860 && nameFontSize > 32) {
    nameFontSize -= 3;
    ctx.font = `bold ${nameFontSize}px 'Fredoka', cursive, sans-serif`;
  }
  ctx.fillStyle = "#d9383a";
  ctx.fillText(`✨ ${supporterName} ✨`, W / 2, 1055);

  ctx.fillStyle = "#124d56";
  ctx.font = "bold 38px 'Fredoka', cursive, sans-serif";
  ctx.fillText("apoio o Natal da Mansão dos Cats!", W / 2, 1125);

  // 8. Card de Manifesto / Frase Emocionante
  drawCardBox(ctx, W / 2 - 420, 1180, 840, 160, "rgba(255, 255, 255, 0.95)", "#24bdcf");
  ctx.fillStyle = "#164e57";
  ctx.font = "600 28px 'Nunito', sans-serif";
  ctx.fillText('"Estou junto nessa corrente do bem para que nenhum', W / 2, 1235);
  ctx.fillText('gatinho resgatado fique sem sachê, ração e amor!" 🥫🥣', W / 2, 1285);

  // 9. Sticker de Toque no Link dos Stories
  drawStickerLink(ctx, W / 2, 1395, 520, 60);

  // 10. Bloco Informativo de CTA e Pix da Campanha
  drawCardBox(ctx, 75, 1475, W - 150, 260, "#ffffff", "#f5a623");

  ctx.fillStyle = "#d9383a";
  ctx.font = "bold 35px 'Fredoka', cursive, sans-serif";
  ctx.fillText("Participe você também! Apadrinhe um gatinho!", W / 2, 1530);

  ctx.fillStyle = "#334155";
  ctx.font = "bold 28px 'Nunito', sans-serif";
  ctx.fillText("Chave Pix E-mail: padrinhogatos@gmail.com", W / 2, 1585);

  ctx.fillStyle = "#126b77";
  ctx.font = "bold 28px 'Nunito', sans-serif";
  ctx.fillText("Titular: FERNANDA GAGLIANO ALVES", W / 2, 1635);

  ctx.fillStyle = "#475569";
  ctx.font = "600 25px 'Nunito', sans-serif";
  ctx.fillText("Presenteie com sachê (R$ 15), ração ou areia! 🎁", W / 2, 1680);

  // Rodapé
  ctx.fillStyle = "rgba(13, 67, 74, 0.85)";
  ctx.font = "bold 26px 'Nunito', sans-serif";
  ctx.fillText("Link na Bio: @mansaodoscats • Guarujá/SP • #NatalDosCats", W / 2, 1860);

  ctx.restore();

  // Logo da Mansão no Topo
  drawLogoOnCanvas(ctx, W / 2, 150, 125);
}

function downloadSupporterCard() {
  const canvas = document.getElementById("supporter-canvas");
  if (!canvas) return;

  const rawName = document.getElementById("supporter-name-input")?.value.trim();
  const safeName = (rawName || "Amigo").replace(/[^a-zA-Z0-9]/g, "_");

  try {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Eu_Apoio_o_Natal_da_Mansao_dos_Cats_${safeName}.png`;
    link.href = dataUrl;
    link.click();
    showToast("Card de apoio baixado! Agora é só postar nos Stories! 📸✨");
  } catch (err) {
    console.error("Erro ao baixar card de apoio", err);
    showToast("Erro ao baixar o card. Tente novamente!");
  }
}

function copyCampaignGeneralText() {
  const rawName = document.getElementById("supporter-name-input")?.value.trim();
  const nameLine = rawName ? `Eu (${rawName}) apoio e divulgo` : `Eu apoio e divulgo`;

  const text = 
    `🎄🐾 ${nameLine} a Campanha de Natal da Mansão dos Cats (Guarujá/SP)! 🎅❤️\n\n` +
    `Neste fim de ano, os gatinhos resgatados precisam muito da nossa ajuda para terem uma ceia gostosa e potinhos cheios. Você pode apadrinhar um gatinho com um sachê (R$ 15), ração ou areia e espalhar essa corrente do bem!\n\n` +
    `👉 Chave Pix: padrinhogatos@gmail.com\n` +
    `👉 Titular da Conta: FERNANDA GAGLIANO ALVES\n` +
    `👉 Instagram Oficial: @mansaodoscats\n\n` +
    `Toque no link da bio para escolher o seu gatinho e apadrinhar! 🐾✨\n\n` +
    `#MansaoDosCats #Guaruja #NatalPet #EuApoio #ApadrinheUmGatinho #AdoteNaoCompre`;
  copyText(text);
}

function copyCampaignSiteLink() {
  copyText(window.location.href);
}

// =================================================================
// 9. ÁREA DA MANSÃO: GERENCIAMENTO DE COMPROVANTES E APADRINHAMENTOS
// =================================================================
const ADMIN_PASSWORD_HASH = "mansao2026"; // Senha padrão para a Fernanda da Mansão

function openAdminModal() {
  const modal = document.getElementById("admin-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  const isAuth = sessionStorage.getItem("mansao_admin_auth") === "true";
  const loginView = document.getElementById("admin-login-view");
  const dashView = document.getElementById("admin-dashboard-view");
  const passInput = document.getElementById("admin-pass-input");
  const errorDiv = document.getElementById("admin-pass-error");

  if (errorDiv) errorDiv.style.display = "none";
  if (passInput) passInput.value = "";

  if (isAuth) {
    if (loginView) loginView.classList.add("hidden");
    if (dashView) dashView.classList.remove("hidden");
    renderAdminDonations();
  } else {
    if (loginView) loginView.classList.remove("hidden");
    if (dashView) dashView.classList.add("hidden");
    setTimeout(() => passInput?.focus(), 150);
  }
}

function closeAdminModal() {
  const modal = document.getElementById("admin-modal");
  if (modal) modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

function handleAdminLogin(e) {
  if (e) e.preventDefault();
  const passInput = document.getElementById("admin-pass-input");
  const errorDiv = document.getElementById("admin-pass-error");
  const val = passInput?.value.trim();

  if (val === ADMIN_PASSWORD_HASH || val === "cats2026" || val === "mansaodoscats") {
    sessionStorage.setItem("mansao_admin_auth", "true");
    if (errorDiv) errorDiv.style.display = "none";
    document.getElementById("admin-login-view")?.classList.add("hidden");
    document.getElementById("admin-dashboard-view")?.classList.remove("hidden");
    renderAdminDonations();
  } else {
    if (errorDiv) errorDiv.style.display = "block";
    passInput?.focus();
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem("mansao_admin_auth");
  openAdminModal();
}

function getStoredDonations() {
  try {
    return JSON.parse(localStorage.getItem("mansao_donations_log") || "[]");
  } catch {
    return [];
  }
}

function renderAdminDonations() {
  const listContainer = document.getElementById("admin-donations-list");
  const countSpan = document.getElementById("admin-donations-count");
  if (!listContainer) return;

  const donations = getStoredDonations();
  if (countSpan) countSpan.textContent = donations.length;

  if (donations.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 32px 16px; color: #64748b; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">📭</div>
        <p style="font-weight: 700; color: #334155; margin-bottom: 4px;">Nenhum apadrinhamento registrado neste dispositivo ainda</p>
        <p style="font-size: 0.84rem;">Quando alguém apadrinhar um gatinho no site, o registro completo com comprovante aparecerá aqui!</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = donations.map((don, idx) => `
    <div class="admin-donation-card">
      <div class="admin-card-main">
        <div class="admin-card-title">
          🐾 ${escapeHtml(don.catName)} • <span style="color: #0d9488;">R$ ${(don.amount || 0).toFixed(2).replace('.', ',')}</span>
        </div>
        <div class="admin-card-subtitle">
          Padrinho(a): <strong>${escapeHtml(don.sponsorName)}</strong> (${escapeHtml(don.giftName)}) • ${escapeHtml(don.date)}
        </div>
        ${don.message ? `<div style="font-size: 0.82rem; color: #475569; font-style: italic; margin-top: 4px;">"${escapeHtml(don.message)}"</div>` : ''}
      </div>
      <div class="admin-card-actions">
        ${don.receiptPreview ? `
          <button class="btn-view-receipt" onclick="viewReceiptPreview(${idx})">
            <i class="fa-solid fa-eye"></i> Ver Comprovante
          </button>
        ` : `
          <span class="btn-no-receipt"><i class="fa-regular fa-image"></i> Sem anexo</span>
        `}
      </div>
    </div>
  `).join("");
}

function viewReceiptPreview(index) {
  const donations = getStoredDonations();
  const don = donations[index];
  if (!don || !don.receiptPreview) return;

  const modal = document.getElementById("receipt-preview-modal");
  const title = document.getElementById("receipt-preview-title");
  const content = document.getElementById("receipt-preview-content");

  if (title) title.textContent = `Comprovante: ${don.sponsorName} para ${don.catName}`;
  if (content) {
    if (don.receiptPreview.startsWith("data:application/pdf")) {
      content.innerHTML = `
        <iframe src="${don.receiptPreview}" style="width: 100%; height: 500px; border: none; border-radius: 8px;"></iframe>
        <div style="margin-top: 10px;">
          <a href="${don.receiptPreview}" download="comprovante_${don.catName}.pdf" class="btn-primary" style="display: inline-flex; text-decoration: none;">
            <i class="fa-solid fa-download"></i> Baixar Arquivo PDF
          </a>
        </div>
      `;
    } else {
      content.innerHTML = `
        <img src="${don.receiptPreview}" alt="Comprovante" style="max-width: 100%; max-height: 65vh; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div style="margin-top: 12px;">
          <a href="${don.receiptPreview}" download="comprovante_${don.catName}.png" class="btn-primary" style="display: inline-flex; text-decoration: none; padding: 8px 18px;">
            <i class="fa-solid fa-download"></i> Baixar Imagem Original
          </a>
        </div>
      `;
    }
  }

  modal?.classList.remove("hidden");
}

function closeReceiptPreviewModal() {
  document.getElementById("receipt-preview-modal")?.classList.add("hidden");
}

function exportDonationsToCsv() {
  const donations = getStoredDonations();
  if (donations.length === 0) {
    alert("Não há apadrinhamentos registrados para exportar.");
    return;
  }

  let csvContent = "\uFEFF"; // BOM para compatibilidade com acentuação no Excel
  csvContent += "Data/Hora,Gatinho,Padrinho,Valor (R$),Presente,Mensagem,Possui Comprovante\n";

  donations.forEach(d => {
    const row = [
      `"${(d.date || '').replace(/"/g, '""')}"`,
      `"${(d.catName || '').replace(/"/g, '""')}"`,
      `"${(d.sponsorName || '').replace(/"/g, '""')}"`,
      `"${(d.amount || 0).toFixed(2).replace('.', ',')}"`,
      `"${(d.giftName || '').replace(/"/g, '""')}"`,
      `"${(d.message || '').replace(/"/g, '""')}"`,
      d.receiptPreview ? "Sim" : "Não"
    ];
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Apadrinhamentos_Mansao_dos_Cats_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function clearAdminDonations() {
  if (confirm("Tem certeza que deseja limpar os registros locais salvos neste dispositivo?")) {
    localStorage.removeItem("mansao_donations_log");
    renderAdminDonations();
    showToast("Histórico de registros limpo.");
  }
}

// Fallback no-op para o modal antigo de importação
function openCsvImporterModal() {}
function closeCsvImporterModal() {}

function parseCsvText(csv) {
  if (!csv || typeof csv !== "string") return [];

  let rows = [];

  // 1. Tentar com PapaParse (padrão ouro em CSV com quebras de linha e aspas)
  if (typeof Papa !== "undefined" && Papa.parse) {
    const parsed = Papa.parse(csv, {
      header: false,
      skipEmptyLines: true
    });
    rows = parsed.data || [];
  } else {
    // 2. Fallback robusto RFC 4180 (respeita quebras de linha dentro de células com aspas)
    rows = parseCsvRFC4180(csv);
  }

  if (rows.length < 2) return [];

  // Identificar índices das colunas a partir do cabeçalho
  const header = rows[0].map(h => (h || "").toString().toLowerCase().trim().replace(/["']/g, ""));
  let idxNome = header.indexOf("nome");
  let idxIdade = header.indexOf("idade");
  let idxCategoria = header.indexOf("categoria");
  let idxTipo = header.indexOf("tipo");
  let idxTags = header.indexOf("tags");
  let idxFoto = header.indexOf("foto");
  let idxHistorinha = header.indexOf("historinha");

  // Fallbacks de índice caso cabeçalho varie
  if (idxNome === -1) idxNome = 0;
  if (idxIdade === -1) idxIdade = 1;
  if (idxCategoria === -1) idxCategoria = 2;
  if (idxTipo === -1) idxTipo = 3;
  if (idxTags === -1) idxTags = 4;
  if (idxFoto === -1) idxFoto = 5;
  if (idxHistorinha === -1) idxHistorinha = 6;

  const cats = [];
  let idCounter = 1;

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i];
    if (!cols || cols.length === 0) continue;

    const clean = (val) => val ? val.toString().trim() : "";
    
    const nome = clean(cols[idxNome]).replace(/^["']|["']$/g, "").trim();

    // Pular linhas vazias, fantasmas ou cabeçalhos duplicados
    if (!nome || nome.length < 2 || nome === ',"' || nome.toLowerCase() === "nome") {
      continue;
    }

    const idade = clean(cols[idxIdade]).replace(/^["']|["']$/g, "").trim();
    const categoria = clean(cols[idxCategoria]).toLowerCase() || "aguardando";
    const tipo = clean(cols[idxTipo]).toLowerCase() || "adulto";
    const tagsRaw = clean(cols[idxTags]);
    const fotoRaw = clean(cols[idxFoto]).replace(/^["']|["']$/g, "").trim();
    const historinha = clean(cols[idxHistorinha]).replace(/^["']|["']$/g, "").trim() || `Gatinho resgatado pela Mansão dos Cats no Guarujá/SP.`;

    // Limpar aspas das tags (ex: ""Carinhosa"", ""Gosta de Colo"" -> Carinhosa, Gosta de Colo)
    const cleanTags = tagsRaw
      .replace(/["']/g, "")
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    // Resolver foto (ImgBB, Google Drive ou local)
    let foto = formatPhotoUrl(fotoRaw);
    if (!foto || foto === "assets/logo-mansao-dos-cats.jpg") {
      if (nome.toLowerCase().includes("norton")) {
        foto = "assets/gatos/Norton.png";
      }
    }

    cats.push({
      id: idCounter++,
      name: nome,
      age: idade || "Adulto",
      category: categoria.includes("apadrinhado") ? "apadrinhado" : "aguardando",
      type: tipo.includes("filhote") ? "filhote" : (tipo.includes("especial") ? "especial" : "adulto"),
      tags: cleanTags.length ? cleanTags : ["Carinhoso", "Castrado"],
      photo: foto || "assets/logo-mansao-dos-cats.jpg",
      bio: historinha,
      sponsorsCount: 0,
      sponsors: []
    });
  }

  return cats;
}

// Tokenizador de Máquina de Estados RFC 4180
function parseCsvRFC4180(text) {
  const rows = [];
  let row = [''];
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (insideQuote && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (c === ',' && !insideQuote) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !insideQuote) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      rows.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }

  if (row.length > 1 || row[0] !== '') {
    rows.push(row);
  }

  return rows;
}

function resetCatsToDefaults() {
  if (confirm("Deseja restaurar a lista inicial com contadores zerados?")) {
    catsList = defaultCatsData.map(c => ({ ...c, sponsorsCount: 0, sponsors: [] }));
    saveCatsData();
    renderCatsGrid(catsList);
    updateStats();
    closeCsvImporterModal();
    showToast("Dados restaurados para o padrão inicial! 🐾");
  }
}

// =================================================================
// 10. UTILITÁRIOS (Toast & Clipboard)
// =================================================================
function copyText(text, btnElement = null) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copiado com sucesso! 📋");
      triggerButtonFeedback(btnElement);
    }).catch(() => fallbackCopy(text, btnElement));
  } else {
    fallbackCopy(text, btnElement);
  }
}

function fallbackCopy(text, btnElement) {
  const tempInput = document.createElement("textarea");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  showToast("Copiado com sucesso! 📋");
  triggerButtonFeedback(btnElement);
}

function triggerButtonFeedback(btn) {
  if (!btn) return;
  const originalHtml = btn.innerHTML;
  btn.innerHTML = `<i class="fa-solid fa-check"></i> Copiado!`;
  setTimeout(() => {
    btn.innerHTML = originalHtml;
  }, 2000);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toast-message");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3200);
}
