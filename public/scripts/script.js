document.addEventListener('DOMContentLoaded', () => {
  const productosLoop = document.getElementById("mas-vendidos-carousel");
  if (productosLoop) {
    const masVendidos = productosData.filter(p => p.categorias.includes("mas-vendido"));
    productosLoop.innerHTML = masVendidos.map(p => `
      <div class="product-slide">
      <a href="producto.html?id=${encodeURIComponent(p.id)}">
      <div class="product-slide-title">${p.nombre}</div>
      <img src="${p.img}" alt="${p.nombre}"  />
      </a>
      </div>
      `).join('');
    }
    const carouselTrack = document.querySelector('.product-carousel-track');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
// Mueve el primer elemento al final
nextBtn.addEventListener("click", () => {
  const first = carrusel.firstElementChild;
  carrusel.appendChild(first);
});

// Mueve el último elemento al inicio
prevBtn.addEventListener("click", () => {
  const last = carrusel.lastElementChild;
  carrusel.insertBefore(last, carrusel.firstElementChild);
});
let position = 0;

function updateCarouselPosition() {
  const slideWidth = carouselTrack.querySelector('.product-slide').offsetWidth + 16; // incluye gap
  carouselTrack.style.transform = `translateX(-${position * slideWidth}px)`;
}

// Carrusel en bucle: mover elementos visualmente
nextBtn.addEventListener("click", () => {
  const first = carouselTrack.firstElementChild;
  carouselTrack.appendChild(first);
  carouselTrack.scrollLeft = 0; // reset scroll
});

prevBtn.addEventListener("click", () => {
  const last = carouselTrack.lastElementChild;
  carouselTrack.insertBefore(last, carouselTrack.firstElementChild);
  carouselTrack.scrollLeft = 0; // reset scroll
});
setInterval(() => {
  const first = carouselTrack.firstElementChild;
  carouselTrack.appendChild(first);
  carouselTrack.scrollLeft = 0;
}, 5000);



    const logo = document.querySelector('.logo');
    logo?.addEventListener('mouseover', () => {
      logo.style.textShadow = '0 0 10px rgba(255,255,255,0.8)';
    });
    logo?.addEventListener('mouseout', () => {
      logo.style.textShadow = 'none';
    });
    const menu = document.querySelector('.menu');
  const toggle = document.querySelector('.menu-toggle');

  if (menu && toggle) {
    toggle.addEventListener('click', () => {
      console.log('Botón hamburguesa clickeado');
      menu.classList.toggle('active');
    });
  } else {
    console.warn('No se encontró .menu o .menu-toggle');
  }

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
  
  
  });
  // Productos dinámicos
  const productosData = [
    { id: "Granizado",nombre: "Granizado de cafe", img: "images/Granizado de cafe.jpg", desc: "Con trozos naturales de fresa. Dulce y refrescante.", categorias: ["favorito"] },
    { id: "Kumis",nombre: "Kumis", img: "images/productos/kumis1.png", desc: "Auténtico y cremoso, el favorito de siempre.", categorias: ["mas-vendido"] },
    { id: "Affogato" , nombre: "Affogato", img: "images/productos/Affogato.webp", desc: "", categorias: ["mas-vendido"] },
    { id: "Agua" , nombre: "Agua en botella", img: "images/productos/Aguaenbotella.webp", desc: "", categorias: ["mas-vendido"] },
    { id: "Almojabana" , nombre: "Almojabana", img: "images/productos/Almojabana.webp", desc: "Bajo en grasa, pero igual de delicioso.", categorias: ["mas-vendido"] },
    { id: "Aromatica" , nombre: "Aromatica", img: "images/productos/Aromatica.webp", desc: "Una explosión de sabor.", categorias: ["mas-vendido"] },
    { id: "Avena" , nombre: "Avena", img: "images/productos/Avena.webp", desc: "Perfecto para quienes cuidan su dieta.", categorias: [] },
    { id: "Capuccino" , nombre: "Capuccino", img: "images/productos/Capuccino.webp", desc: "Refrescante y tropical.", categorias: ["favorito"] },
    { id: "Chococono" , nombre: "Chococono", img: "images/productos/Choco_Cono.webp", desc: "", categorias: [] },
    { id: "Chocokumis" , nombre: "Chocokumis", img: "images/productos/ChocoKumis.webp", desc: "Ácido y dulce, para paladares intensos.", categorias: [] },
    { id: "Citrica" , nombre: "Cítrica", img: "images/productos/Citrica.webp", desc: "", categorias: ["mas-vendido"] },
    { id: "Empanadadecarne" , nombre: "Empanada de carne", img: "images/productos/Empanadadecarne.webp", desc: "", categorias: ["mas-vendido"] },
    { id: "Empanadadepollo" , nombre: "Empanada de pollo", img: "images/productos/Empanadadepollo.webp", desc: "El sabor colombiano por excelencia.", categorias: ["mas-vendido"] },
    { id: "Empanadallanera" , nombre: "Empanada llanera", img: "images/productos/Empanadallanera.webp", desc: "", categorias: ["favorito"] },
    { id: "Galletadeavena" , nombre: "Galleta de avena", img: "images/productos/Galletadeavena.webp", desc: "Tradicional y lleno de energía natural.", categorias: [] },
    { id: "KumisCono" , nombre: "Kumis Cono", img: "images/productos/KumisCono.webp", desc: "Tradicional y lleno de energía natural.", categorias: [] }
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

      // Subir la vista al inicio de la sección de productos
      document.querySelector(".productos-section").scrollIntoView({
        behavior: "smooth"
      });
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
