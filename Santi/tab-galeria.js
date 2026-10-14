// ==========================================
// MOTOR DEL TAB DE GALERÍA (FILTROS FIJOS: AÑO Y CATEGORÍAS SELECCIONADAS)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tab-galeria-container");
  if (!container) return;

  // 1. Construir la estructura base de forma segura con createElement
  const wrapper = document.createElement("div");
  wrapper.className = "galeria-tab-wrapper";

  const galeriaContainer = document.createElement("div");
  galeriaContainer.className = "galeria-container";

  const header = document.createElement("header");
  header.className = "galeria-header";

  const title = document.createElement("h2");
  title.textContent = "Portafolio de Santi621";

  const subtitle = document.createElement("p");
  subtitle.textContent = "Colección de dibujos y fanarts digitales subidos en Twitter";

  header.appendChild(title);
  header.appendChild(subtitle);

  // Contenedores para las barras de pestañas (Años y Categorías)
  const filtrosWrapper = document.createElement("div");
  filtrosWrapper.className = "filtros-wrapper";

  const anosTabsContainer = document.createElement("div");
  anosTabsContainer.className = "anos-tabs";
  anosTabsContainer.id = "anosTabsContainer";

  const categoriasTabsContainer = document.createElement("div");
  categoriasTabsContainer.className = "anos-tabs"; // Reutilizamos el estilo de pestañas
  categoriasTabsContainer.id = "categoriasTabsContainer";

  filtrosWrapper.appendChild(anosTabsContainer);
  filtrosWrapper.appendChild(categoriasTabsContainer);

  const gridContainer = document.createElement("div");
  gridContainer.className = "dibujos-grid";
  gridContainer.id = "dibujosGridContainer";

  galeriaContainer.appendChild(header);
  galeriaContainer.appendChild(filtrosWrapper);
  galeriaContainer.appendChild(gridContainer);
  wrapper.appendChild(galeriaContainer);

  // Estructura del Modal
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.id = "dibujoModal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const modalHeaderBar = document.createElement("div");
  modalHeaderBar.className = "modal-header-bar";

  const modalCloseBtn = document.createElement("button");
  modalCloseBtn.className = "modal-close";
  modalCloseBtn.id = "modalCloseBtn";
  modalCloseBtn.innerHTML = "&times;";

  modalHeaderBar.appendChild(modalCloseBtn);

  const modalBody = document.createElement("div");
  modalBody.className = "modal-body";

  const modalImgContainer = document.createElement("div");
  modalImgContainer.className = "modal-img-container";

  const modalImg = document.createElement("img");
  modalImg.id = "modalImg";
  modalImg.alt = "Vista previa";

  modalImgContainer.appendChild(modalImg);

  const modalDetails = document.createElement("div");
  modalDetails.className = "modal-details";

  const modalMeta = document.createElement("div");
  modalMeta.className = "modal-meta-info";
  modalMeta.id = "modalMeta";

  const modalTitle = document.createElement("h3");
  modalTitle.id = "modalTitle";

  const modalDesc = document.createElement("p");
  modalDesc.id = "modalDesc";

  modalDetails.appendChild(modalMeta);
  modalDetails.appendChild(modalTitle);
  modalDetails.appendChild(modalDesc);

  modalBody.appendChild(modalImgContainer);
  modalBody.appendChild(modalDetails);

  modalContent.appendChild(modalHeaderBar);
  modalContent.appendChild(modalBody);
  modal.appendChild(modalContent);

  wrapper.appendChild(modal);
  container.appendChild(wrapper);

  // Verificar datos
  if (typeof MIS_DIBUJOS === "undefined" || !Array.isArray(MIS_DIBUJOS)) {
    const errorMsg = document.createElement("p");
    errorMsg.style.cssText = "text-align:center; color:#94a3b8; grid-column: 1/-1;";
    errorMsg.textContent = "No se encontró el archivo de datos (dibujos-data.js).";
    gridContainer.appendChild(errorMsg);
    return;
  }

  // Extraer años únicos de forma automática
  const anosUnicos = [...new Set(MIS_DIBUJOS.map(d => d.anio))].sort((a, b) => b - a);
  const listaAnos = ["Todos", ...anosUnicos];

  // Lista fija de categorías solicitadas (incluyendo "Pedido")
  const listaCategorias = [
    "Todas las Categorías", 
    "Ilustración", 
    "Fanart", 
    "Fanart / Ilustración", 
    "Pedido"
  ];

  let anoActivo = "Todos";
  let categoriaActiva = "Todas las Categorías";

  // 2. Renderizar pestañas de Años
  function renderizarAnosTabs() {
    anosTabsContainer.replaceChildren();

    listaAnos.forEach(ano => {
      const btn = document.createElement("button");
      btn.className = `tab-btn ${ano === anoActivo ? "active" : ""}`;
      btn.textContent = ano;
      btn.addEventListener("click", () => {
        anoActivo = ano;
        renderizarAnosTabs();
        renderizarDibujos();
      });
      anosTabsContainer.appendChild(btn);
    });
  }

  // 3. Renderizar pestañas de Categorías Fijas
  function renderizarCategoriasTabs() {
    categoriasTabsContainer.replaceChildren();

    listaCategorias.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = `tab-btn ${cat === categoriaActiva ? "active" : ""}`;
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        categoriaActiva = cat;
        renderizarCategoriasTabs();
        renderizarDibujos();
      });
      categoriasTabsContainer.appendChild(btn);
    });
  }

  // 4. Renderizar cuadrícula aplicando ambos filtros combinados
  function renderizarDibujos() {
    gridContainer.replaceChildren();

    const dibujosFiltrados = MIS_DIBUJOS.filter(dibujo => {
      const cumpleAno = (anoActivo === "Todos" || dibujo.anio === anoActivo);
      const cumpleCat = (categoriaActiva === "Todas las Categorías" || dibujo.categoria === categoriaActiva);
      return cumpleAno && cumpleCat;
    });

    if (dibujosFiltrados.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.style.cssText = "text-align:center; color:#94a3b8; grid-column: 1/-1; padding: 2rem;";
      emptyMsg.textContent = "No hay dibujos que coincidan con estos filtros.";
      gridContainer.appendChild(emptyMsg);
      return;
    }

    dibujosFiltrados.forEach(dibujo => {
      const card = document.createElement("div");
      card.className = "dibujo-card";

      const imagenWrap = document.createElement("div");
      imagenWrap.className = "dibujo-imagen-wrap";

      const img = document.createElement("img");
      img.src = dibujo.imagen;
      img.alt = dibujo.titulo;
      img.loading = "lazy";
      imagenWrap.appendChild(img);

      const info = document.createElement("div");
      info.className = "dibujo-info";

      const meta = document.createElement("div");
      meta.className = "dibujo-meta";

      const spanAnio = document.createElement("span");
      spanAnio.className = "dibujo-anio";
      spanAnio.textContent = dibujo.anio;

      const spanCat = document.createElement("span");
      spanCat.className = "dibujo-categoria";
      spanCat.textContent = dibujo.categoria || "Arte";

      meta.appendChild(spanAnio);
      meta.appendChild(spanCat);

      const h4 = document.createElement("h4");
      h4.className = "dibujo-titulo";
      h4.textContent = dibujo.titulo;

      const desc = document.createElement("p");
      desc.className = "dibujo-desc";
      desc.textContent = dibujo.descripcion;

      info.appendChild(meta);
      info.appendChild(h4);
      info.appendChild(desc);

      card.appendChild(imagenWrap);
      card.appendChild(info);

      // Evento del Modal
      card.addEventListener("click", () => {
        modalImg.src = dibujo.imagen;
        modalTitle.textContent = dibujo.titulo;
        modalMeta.textContent = `${dibujo.anio} • ${dibujo.categoria || "Arte"}`;
        modalDesc.textContent = dibujo.descripcion;
        modal.classList.add("open");
      });

      gridContainer.appendChild(card);
    });
  }

  // 5. Control del Modal
  function cerrarModal() {
    modal.classList.remove("open");
  }

  modalCloseBtn.addEventListener("click", cerrarModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModal();
  });

  // Inicializar todo
  renderizarAnosTabs();
  renderizarCategoriasTabs();
  renderizarDibujos();
});