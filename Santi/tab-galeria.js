class TabGaleria extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM activo para aislar el HTML y los estilos de la galería
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          /* Movemos las variables dentro de :host en lugar de :root */
          --bg-color: #f8fafc;         /* Fondo claro/crema suave */
          --card-bg: #ffffff;          /* Tarjetas en blanco puro */
          --card-hover: #ffffff;       /* Fondo al pasar el mouse */
          --text-main: #0f172a;        /* Texto principal oscuro muy legible */
          --text-muted: #64748b;       /* Texto secundario gris suave */
          
          /* Colores alegres y vistosos */
          --accent-color: #ec4899;     /* Rosa/Fucsia alegre */
          --accent-cyan: #0284c7;      /* Azul cian vibrante para categorías */
          --accent-gradient: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
          
          --border-color: #e2e8f0;     /* Bordes suaves claros */
          --shadow-card: 0 4px 12px rgba(15, 23, 42, 0.05);
          --shadow-hover: 0 12px 28px rgba(15, 23, 42, 0.12);
        }

        .galeria-tab-wrapper {
          font-family: 'Fredoka', cursive, sans-serif, system-ui;
          background-color: var(--bg-color);
          color: var(--text-main);
          padding: 3rem 2rem;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .galeria-container {
          max-width: 1300px;
          margin: 0 auto;
        }

        /* --- ENCABEZADO EXPRESIVO --- */
        .galeria-header {
          text-align: left;
          margin-bottom: 2rem;
          border-bottom: 2px dashed #cbd5e1;
          padding-bottom: 1.5rem;
        }

        .galeria-header h2 {
          font-size: 2.8rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin: 0 0 0.3rem 0;
          background: var(--accent-gradient);
          -webkit-background-clip: text; /* Requerido para Chrome/Edge/Safari */
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .galeria-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
          font-weight: 400;
          margin: 0;
        }

        /* --- FILTROS --- */
        .filtros-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2.5rem;
          align-items: flex-start;
        }

        .anos-tabs {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        /* --- BOTONES / PESTAÑAS (ESTILO BOTÓN VIBRANTE) --- */
        .tab-btn {
          background-color: var(--card-bg);
          color: var(--text-muted);
          border: 2px solid var(--border-color);
          padding: 0.55rem 1.3rem;
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Fredoka', cursive, sans-serif;
          box-shadow: 0 2px 5px rgba(0,0,0,0.03);
        }

        .tab-btn:hover {
          background-color: #f1f5f9;
          color: var(--text-main);
          border-color: var(--accent-color);
          transform: translateY(-2px);
        }

        .tab-btn.active {
          background: var(--accent-gradient);
          color: white;
          border-color: transparent;
          font-weight: 600;
          box-shadow: 0 6px 18px rgba(236, 72, 153, 0.35);
          transform: scale(1.03);
        }

        /* --- CUADRÍCULA --- */
        .dibujos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 2rem;
        }

        /* --- TARJETAS BLANCAS CON SOMBRA SUAVE --- */
        .dibujo-card {
          background-color: var(--card-bg);
          border-radius: 20px;
          overflow: hidden;
          border: 2px solid var(--border-color);
          box-shadow: var(--shadow-card);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }

        .dibujo-card:hover {
          transform: translateY(-6px) rotate(0.5deg);
          box-shadow: var(--shadow-hover);
          border-color: var(--accent-color);
        }

        .dibujo-imagen-wrap {
          width: 100%;
          height: 240px;
          overflow: hidden;
          background-color: #f1f5f9;
          position: relative;
        }

        .dibujo-imagen-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .dibujo-card:hover .dibujo-imagen-wrap img {
          transform: scale(1.07);
        }

        .dibujo-info {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .dibujo-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.6rem;
        }

        .dibujo-anio {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-color);
          background: rgba(236, 72, 153, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 8px;
        }

        .dibujo-categoria {
          font-size: 0.75rem;
          color: var(--accent-cyan);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        .dibujo-titulo {
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0 0 0.4rem 0;
          color: var(--text-main);
        }

        .dibujo-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* --- MODAL CON FONDO CLARO / ELEGANTE --- */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.65); /* Fondo oscuro translúcido para resaltar el modal */
          backdrop-filter: blur(6px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          padding: 1.5rem;
          box-sizing: border-box;
        }

        .modal-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .modal-content {
          background: var(--card-bg);
          border: 2px solid var(--border-color);
          border-radius: 24px;
          max-width: 950px;
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          transform: scale(0.95);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-overlay.open .modal-content {
          transform: scale(1);
        }

        .modal-header-bar {
          display: flex;
          justify-content: flex-end;
          padding: 0.75rem 1.25rem;
          background: #f8fafc;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-close {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.8rem;
          cursor: pointer;
          transition: color 0.2s;
          line-height: 1;
        }

        .modal-close:hover {
          color: var(--accent-color);
        }

        .modal-body {
          display: flex;
          flex-direction: column;
        }

        @media(min-width: 768px) {
          .modal-body {
            flex-direction: row;
          }
        }

        .modal-img-container {
          flex: 1.6;
          background: #bcc2c9;
          display: flex;
          align-items: center;
          justify-content: center;
          max-height: 550px;
          padding: 1rem;
        }

        .modal-img-container img {
          max-width: 100%;
          max-height: 520px;
          object-fit: contain;
          border-radius: 0; 
        }

        .modal-details {
          flex: 1;
          padding: 2.2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background-color: var(--card-bg);
        }

        .modal-details h3 {
          margin: 0 0 0.6rem 0;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .modal-details .modal-meta-info {
          font-size: 0.85rem;
          color: var(--accent-cyan);
          margin-bottom: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .modal-details p {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.6;
          margin: 0;
        }
      </style>

      <div class="galeria-tab-wrapper">
        <div class="galeria-container">
          <header class="galeria-header">
            <h2>Portafolio de Santi621</h2>
            <p>Colección de dibujos y fanarts digitales subidos en Twitter</p>
          </header>

          <div class="filtros-wrapper">
            <div class="anos-tabs" id="anosTabsContainer"></div>
            <div class="anos-tabs" id="categoriasTabsContainer"></div>
          </div>

          <div class="dibujos-grid" id="dibujosGridContainer"></div>
        </div>

        <!-- Modal de vista previa -->
        <div class="modal-overlay" id="dibujoModal">
          <div class="modal-content">
            <div class="modal-header-bar">
              <button class="modal-close" id="modalCloseBtn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="modal-img-container">
                <img id="modalImg" alt="Vista previa" />
              </div>
              <div class="modal-details">
                <div class="modal-meta-info" id="modalMeta"></div>
                <h3 id="modalTitle"></h3>
                <p id="modalDesc"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Selección de elementos del DOM dentro del Shadow Root
    const shadow = this.shadowRoot;
    const gridContainer = shadow.getElementById("dibujosGridContainer");
    const anosTabsContainer = shadow.getElementById("anosTabsContainer");
    const categoriasTabsContainer = shadow.getElementById("categoriasTabsContainer");
    const modal = shadow.getElementById("dibujoModal");
    const modalImg = shadow.getElementById("modalImg");
    const modalTitle = shadow.getElementById("modalTitle");
    const modalMeta = shadow.getElementById("modalMeta");
    const modalDesc = shadow.getElementById("modalDesc");
    const modalCloseBtn = shadow.getElementById("modalCloseBtn");

    if (typeof MIS_DIBUJOS === "undefined" || !Array.isArray(MIS_DIBUJOS)) {
      const errorMsg = document.createElement("p");
      errorMsg.style.cssText = "text-align:center; color:var(--text-muted); grid-column: 1/-1;";
      errorMsg.textContent = "No se encontró el archivo de datos (dibujos-data.js).";
      gridContainer.appendChild(errorMsg);
      return;
    }

    const anosUnicos = [...new Set(MIS_DIBUJOS.map(d => d.anio))].sort((a, b) => b - a);
    const listaAnos = ["Todos", ...anosUnicos];

    const listaCategorias = [
      "Todas las Categorías", 
      "Ilustración", 
      "Fanart", 
      "Fanart / Ilustración", 
      "Pedido"
    ];

    let anoActivo = "Todos";
    let categoriaActiva = "Todas las Categorías";

    const renderizarAnosTabs = () => {
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
    };

    const renderizarCategoriasTabs = () => {
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
    };

    const renderizarDibujos = () => {
      gridContainer.replaceChildren();

      const dibujosFiltrados = MIS_DIBUJOS.filter(dibujo => {
        const cumpleAno = (anoActivo === "Todos" || dibujo.anio === anoActivo);
        const cumpleCat = (categoriaActiva === "Todas las Categorías" || dibujo.categoria === categoriaActiva);
        return cumpleAno && cumpleCat;
      });

      if (dibujosFiltrados.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.style.cssText = "text-align:center; color:var(--text-muted); grid-column: 1/-1; padding: 2rem;";
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

        card.addEventListener("click", () => {
          modalImg.src = dibujo.imagen;
          modalTitle.textContent = dibujo.titulo;
          modalMeta.textContent = `${dibujo.anio} — ${dibujo.categoria || "Arte"}`;
          modalDesc.textContent = dibujo.descripcion;
          modal.classList.add("open");
        });

        gridContainer.appendChild(card);
      });
    };

    const cerrarModal = () => {
      modal.classList.remove("open");
    };

    modalCloseBtn.addEventListener("click", cerrarModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrarModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") cerrarModal();
    });

    renderizarAnosTabs();
    renderizarCategoriasTabs();
    renderizarDibujos();
  }
}

// Registro del Web Component ante el navegador
customElements.define("tab-galeria", TabGaleria);