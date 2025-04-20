document.addEventListener('DOMContentLoaded', () => {
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
  