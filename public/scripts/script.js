document.addEventListener('DOMContentLoaded', () => {
  const productosLoop = document.getElementById("mas-vendidos-carousel");
if (productosLoop) {
  const masVendidos = productosData.filter(p => p.categorias.includes("mas-vendido"));
  const duplicados = [...masVendidos, ...masVendidos, ...masVendidos]; // 3 veces para evitar espacios

  productosLoop.innerHTML = duplicados.map(p => `
    <div class="product-slide">
      <a href="producto.html?id=${encodeURIComponent(p.id)}">
        <img src="${p.img}" alt="${p.nombre}" title="${p.nombre}" />
      </a>
    </div>
  `).join('');
}


    const logo = document.querySelector('.logo');
    logo?.addEventListener('mouseover', () => {
      logo.style.textShadow = '0 0 10px rgba(255,255,255,0.8)';
    });
    logo?.addEventListener('mouseout', () => {
      logo.style.textShadow = 'none';
    });
  
    const form = document.getElementById('formulario-contacto');
    form?.addEventListener('submit', e => {
      e.preventDefault();
      alert('Gracias por contactarnos. Pronto te responderemos.');
      form.reset();
    });
  
    const slidesContainer = document.querySelector('.slides');
    const slideImages = document.querySelectorAll('.slides img');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
  
    function showSlide(index) {
      slidesContainer.style.transform = `translateX(-${index * 100}vw)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
  
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentIndex = parseInt(dot.dataset.index);
        showSlide(currentIndex);
      });
    });
  
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slideImages.length;
      showSlide(currentIndex);
    }, 4000);
  
    const track = document.querySelector('.product-track');
    const slidesSmall = document.querySelectorAll('.product-slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
  
    let index = 0;
    const maxIndex = slidesSmall.length;
  
    function updateProductCarousel() {
      const slideWidth = slidesSmall[0].offsetWidth + 16;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
    }
  
    nextBtn?.addEventListener('click', () => {
      index = (index + 1) % maxIndex;
      updateProductCarousel();
    });
  
    prevBtn?.addEventListener('click', () => {
      index = (index - 1 + maxIndex) % maxIndex;
      updateProductCarousel();
    });
  
    const menu = document.querySelector('.menu');
    const toggle = document.createElement('div');
    toggle.classList.add('menu-toggle');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    document.querySelector('.header-nav').appendChild(toggle);
  
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  });
  // Productos dinámicos
  const productosData = [
    { id: "fresa",nombre: "Kumis con Fresa", img: "images/kumis-fresa.jpg", desc: "Con trozos naturales de fresa. Dulce y refrescante.", categorias: ["favorito"] },
    { id: "Tradicional",nombre: "Kumis Tradicional", img: "images/kumis-tradicional.jpg", desc: "Auténtico y cremoso, el favorito de siempre.", categorias: ["mas-vendido"] },
    { id: "Durazno" , nombre: "Kumis con Durazno", img: "images/kumis-durazno.jpg", desc: "Dulce natural con un toque de durazno maduro.", categorias: [] },
    { id: "Mango" , nombre: "Kumis con Mango", img: "images/kumis-mango.jpg", desc: "Sabroso y tropical, ideal para días soleados.", categorias: [] },
    { id: "Light" , nombre: "Kumis Light", img: "images/kumis-natural-light.jpg", desc: "Bajo en grasa, pero igual de delicioso.", categorias: [] },
    { id: "Mora" , nombre: "Kumis con Mora", img: "images/kumis-mora.jpg", desc: "Una explosión de sabor con mora fresca.", categorias: ["mas-vendido"] },
    { id: "Azucar" , nombre: "Kumis sin Azúcar", img: "images/kumis-sin-azucar.jpg", desc: "Perfecto para quienes cuidan su dieta.", categorias: [] },
    { id: "Pina" , nombre: "Kumis con Piña", img: "images/kumis-pina.jpg", desc: "Refrescante y tropical con trocitos reales.", categorias: ["favorito"] },
    { id: "Maracuya" , nombre: "Kumis con Maracuyá", img: "images/kumis-maracuya.jpg", desc: "Ácido y dulce, para paladares intensos.", categorias: [] },
    { id: "Clasico" , nombre: "Kumis Clásico", img: "images/kumis-clasico.jpg", desc: "Elaborado artesanalmente con leche fresca.", categorias: [] },
    { id: "Coco" , nombre: "Kumis con Coco", img: "images/kumis-coco.jpg", desc: "Cremoso y exótico, como el Caribe.", categorias: ["mas-vendido"] },
    { id: "Banana" , nombre: "Kumis con Banana", img: "images/kumis-banana.jpg", desc: "Suave, dulce y muy nutritivo.", categorias: [] },
    { id: "Guayaba" , nombre: "Kumis con Guayaba", img: "images/kumis-guayaba.jpg", desc: "El sabor colombiano por excelencia.", categorias: [] },
    { id: "Griego" , nombre: "Kumis estilo Griego", img: "images/kumis-griego.jpg", desc: "Más espeso y proteico, ideal para desayunos.", categorias: ["favorito"] },
    { id: "Avena" , nombre: "Kumis con Avena", img: "images/kumis-avena.jpg", desc: "Tradicional y lleno de energía natural.", categorias: [] }
  ];

  const container = document.getElementById("productos-container");
  const paginacion = document.getElementById("paginacion");
  const filtroBtns = document.querySelectorAll(".filtro-btn");
  const ordenarSelect = document.getElementById("ordenar");

  // NUEVO: Buscador
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Buscar producto...";
  searchInput.className = "buscador";
  document.querySelector(".filtros").appendChild(searchInput);

  // NUEVO: Volver arriba
  const volverArriba = document.createElement("button");
  volverArriba.textContent = "↑ Volver arriba";
  volverArriba.className = "volver-arriba";
  document.body.appendChild(volverArriba);

  volverArriba.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  let productosFiltrados = [...productosData];
  let currentPage = 1;
  const itemsPerPage = 6;

  function renderProductos() {
    container.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginaProductos = productosFiltrados.slice(start, end);

    paginaProductos.forEach(prod => {
      const box = document.createElement("div");
      box.className = `producto-box ${prod.categorias.join(" ")}`;
      if (prod.categorias.includes("favorito")) {
        box.innerHTML += `<span class="etiqueta favorito">★ Favorito</span>`;
      }
      if (prod.categorias.includes("mas-vendido")) {
        box.innerHTML += `<span class="etiqueta mas-vendido">🔥 Más vendido</span>`;
      }
     box.innerHTML += `
  <a href="producto.html?id=${encodeURIComponent(prod.id)}" target="">
    <img src="${prod.img}" alt="${prod.nombre}" />
    <div class="info-producto">
      <h3>${prod.nombre}</h3>
      <p>${prod.desc}</p>
    </div>
  </a>
`;

      container.appendChild(box);
    });
    renderPaginacion();
  }

  function renderPaginacion() {
    const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
    paginacion.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? "activo" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        renderProductos();
      });
      paginacion.appendChild(btn);
    }
  }

  filtroBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filtroBtns.forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");
      const filtro = btn.dataset.filtro;
      productosFiltrados = filtro === "todos"
        ? [...productosData]
        : productosData.filter(p => p.categorias.includes(filtro));
      searchInput.value = "";
      currentPage = 1;
      renderProductos();
    });
  });

  ordenarSelect.addEventListener("change", () => {
    const val = ordenarSelect.value;
    if (val === "nombre-asc") {
      productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (val === "nombre-desc") {
      productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }
    renderProductos();
  });

  // NUEVO: Buscador en tiempo real
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    productosFiltrados = productosData.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query)
    );
    filtroBtns.forEach(b => b.classList.remove("activo"));
    ordenarSelect.value = "";
    currentPage = 1;
    renderProductos();
  });

  renderProductos();
