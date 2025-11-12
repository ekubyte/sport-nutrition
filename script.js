// script.js (¡Actualizado!)

// --- Base de Datos de Productos (¡Con imágenes nuevas!) ---
const productos = [
  {
    id: "prod_001",
    nombre: "Barra Energética de Quinua y Cacao",
    descripcion: "Combustible puro. Quinua real, cacao orgánico y miel de los Andes.",
    precio_soles: 5.50,
    imagen: "https://images.pexels.com/photos/4113865/pexels-photo-4113865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "prod_002",
    nombre: "Snack de Maca y Almendras",
    descripcion: "Resistencia y enfoque. Maca andina, almendras tostadas y canela.",
    precio_soles: 6.00,
    imagen: "https://images.pexels.com/photos/4041123/pexels-photo-4041123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "prod_003",
    nombre: "Gel de Kiwicha y Maracuyá",
    descripcion: "Energía rápida y natural. Impulso instantáneo para tu ejercicio.",
    precio_soles: 4.00,
    imagen: "https://images.pexels.com/photos/5938435/pexels-photo-5938435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: "prod_004",
    nombre: "Mix Andino (Kañiwa y Arándanos)",
    descripcion: "El snack perfecto para trekking. Lleno de antioxidantes y fibra.",
    precio_soles: 7.50,
    imagen: "https://images.pexels.com/photos/1453472/pexels-photo-1453472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

// --- Estado Global ---
let cart = [];

/**
 * Inicialización del Sitio ---
 */
document.addEventListener('DOMContentLoaded', () => {
  // Cargar carrito del localStorage
  const cartData = localStorage.getItem('sportNutritionCart');
  cart = cartData ? JSON.parse(cartData) : [];
  
  console.log('🛒 Carrito cargado:', cart); // Debug
  
  initCommonElements();
  initScrollAnimations();
  
  if (document.getElementById('productos-grid')) {
    initProductosPage();
  }
  if (document.getElementById('pedido-form')) {
    initPedidosPage();
  }
  if (document.getElementById('hero-section')) {
    document.querySelectorAll('section').forEach((section, index) => {
      section.style.animationDelay = `${index * 100}ms`;
      section.classList.add('animate-fadeIn');
    });
  }
});

/**
 * Inicializa animaciones de scroll (Intersection Observer)
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animar items dentro del elemento (iconos, tarjetas, etc)
        const items = entry.target.querySelectorAll('[data-animate-item]');
        
        if (items.length > 0) {
          items.forEach((item, index) => {
            // Asegurar que está oculto inicialmente
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) scale(0.9)';
            item.style.transition = 'none';
            
            // Aplicar animación con delay
            setTimeout(() => {
              item.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
          });
        }
        
        // Dejar de observar después de animar
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar todos los elementos con data-animate
  document.querySelectorAll('[data-animate]').forEach(element => {
    observer.observe(element);
  });
}

/**
 * Inicializa elementos comunes (header, carrito, modo oscuro)
 */
function initCommonElements() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn) {
    mobileMenuBtn.onclick = () => {
      mobileMenu.classList.toggle('active');
      // Animar items del menú
      if (mobileMenu.classList.contains('active')) {
        const items = mobileMenu.querySelectorAll('a');
        items.forEach((item, index) => {
          item.style.animation = 'none';
          setTimeout(() => {
            item.style.animation = `slideInLeft 0.3s ease-out ${index * 50}ms forwards`;
          }, 10);
        });
      }
    };
  }

  const toggleBtn = document.getElementById('dark-mode-toggle');
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  if (toggleBtn) {
    toggleBtn.onclick = toggleDarkMode;
  }

  const cartBtn = document.getElementById('cart-btn');
  const cartModalContainer = document.getElementById('cart-modal-container');
  const closeCartBtn = document.getElementById('close-cart-btn');
  
  // Usamos funciones wrapper para evitar que el evento click se pase como
  // argumento a `toggleCartModal` (si se pasa, el evento es truthy y
  // se interpreta como `forceOpen`, impidiendo el cierre).
  if (cartBtn) cartBtn.onclick = () => toggleCartModal();
  if (cartModalContainer) cartModalContainer.onclick = (e) => {
    if (e.target === cartModalContainer) toggleCartModal();
  };
  if (closeCartBtn) closeCartBtn.onclick = () => toggleCartModal();

  updateCartBadge();
  renderCartModal();

  // Agregar animaciones a enlaces de navegación
  document.querySelectorAll('nav a, .mobile-menu a').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

/**
 * Lógica del Modo Oscuro
 */
function toggleDarkMode() {
  const html = document.documentElement;
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

/**
 * Lógica de la Página de Productos
 */
function initProductosPage() {
  const grid = document.getElementById('productos-grid');
  grid.innerHTML = ""; // Limpiar
  
  productos.forEach((prod, index) => {
    const card = document.createElement('div');
    card.className = "flex flex-col gap-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark overflow-hidden animate-fadeIn hover-lift transition-all duration-300 hover:shadow-2xl";
    card.style.animationDelay = `${index * 100}ms`;
    card.innerHTML = `
      <div class="aspect-video w-full bg-cover bg-center transition-transform duration-300 hover:scale-110" style='background-image: url("${prod.imagen}");'></div>
      <div class="flex flex-col gap-4 p-6">
        <div class="flex flex-col gap-1">
          <h3 class="font-display text-lg font-bold group-hover:text-primary transition-colors">${prod.nombre}</h3>
          <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${prod.descripcion}</p>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-display text-lg font-bold text-primary">S/ ${prod.precio_soles.toFixed(2)}</span>
          <button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-light text-sm font-bold tracking-wide transition-all hover:scale-110 hover:shadow-lg font-display hover-glow group" onclick="addToCart('${prod.id}')">
            <span class="material-symbols-outlined text-xl mr-1 group-hover:animate-pulse">add_shopping_cart</span>
            <span class="truncate">Añadir</span>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/**
 * Lógica de la Página de Pedidos (¡CORREGIDO!)
 */
function initPedidosPage() {
  const summaryElement = document.getElementById('pedido-resumen');
  const form = document.getElementById('pedido-form');
  const submitButton = document.getElementById('pedido-submit-btn');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  
  console.log('📋 Inicializando página de pedidos. Carrito:', cart); // Debug
  
  if (!cart || cart.length === 0) {
    // Si el carrito está vacío
    summaryElement.innerHTML = '';
    if (emptyCartMessage) {
      emptyCartMessage.classList.remove('hidden');
    }
    form.classList.add('opacity-50');
    submitButton.disabled = true;
    submitButton.innerText = "Carrito Vacío";
    return;
  }
  
  // Si hay items, oculta el mensaje de carrito vacío y activa el formulario
  if (emptyCartMessage) {
    emptyCartMessage.classList.add('hidden');
  }
  form.classList.remove('opacity-50');
  submitButton.disabled = false;
  submitButton.innerText = "Confirmar Pedido por WhatsApp";

  // Renderiza el resumen del pedido
  let total = 0;
  let summaryHTML = '<ul class="space-y-4">';
  
  cart.forEach(item => {
    const producto = productos.find(p => p.id === item.id);
    if (!producto) {
      console.warn(`⚠️ Producto con ID ${item.id} no encontrado.`);
      return;
    }
    summaryHTML += `
      <li class="flex items-center justify-between">
        <div>
          <p class="font-bold">${producto.nombre}</p>
          <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${item.quantity} x S/ ${producto.precio_soles.toFixed(2)}</p>
        </div>
        <p class="font-bold">S/ ${(item.quantity * producto.precio_soles).toFixed(2)}</p>
      </li>
    `;
    total += item.quantity * producto.precio_soles;
  });
  
  summaryHTML += `</ul><hr class="my-4 border-border-light dark:border-border-dark">
    <div class="flex justify-between font-display text-lg font-bold">
      <span>Total:</span>
      <span>S/ ${total.toFixed(2)}</span>
    </div>`;
    
  summaryElement.innerHTML = summaryHTML;
}

/**
 * Genera y abre el enlace de WhatsApp con el pedido (¡CON TU NÚMERO!)
 */
function generarMensajeWhatsapp(event) {
  if (event) {
    event.preventDefault();
  }
  
  const nombre = document.getElementById('nombre').value.trim();
  const celular = document.getElementById('celular').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  
  // Validación
  if (!nombre || !celular || !direccion) {
    alert('⚠️ Por favor completa todos los campos.');
    return;
  }
  
  if (cart.length === 0) {
    alert('⚠️ Tu carrito está vacío. Agrega productos antes de confirmar.');
    return;
  }
  
  // TU NÚMERO DE WHATSAPP
  const tuNumero = '51959336767';
  
  let mensaje = `¡Hola SPORT NUTRITION! 👋\n\nQuisiera hacer el siguiente pedido:\n\n`;
  let total = 0;
  
  cart.forEach(item => {
    const producto = productos.find(p => p.id === item.id);
    if (!producto) {
      console.warn(`⚠️ Producto con ID ${item.id} no encontrado.`);
      return;
    }
    mensaje += `*${item.quantity}x* - ${producto.nombre} (S/ ${(item.quantity * producto.precio_soles).toFixed(2)})\n`;
    total += item.quantity * producto.precio_soles;
  });
  
  mensaje += `\n*Total del Pedido:* S/ ${total.toFixed(2)}\n\n`;
  mensaje += `*Mis datos de entrega:*\n`;
  mensaje += `*Nombre:* ${nombre}\n`;
  mensaje += `*Celular:* ${celular}\n`;
  mensaje += `*Dirección:* ${direccion}\n\n`;
  mensaje += `¡Espero la confirmación! Gracias.`;
  
  console.log('📱 Enviando mensaje a WhatsApp:', mensaje); // Debug
  
  const url = `https://wa.me/${tuNumero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
  
  // Limpiar carrito
  cart = [];
  saveCart();
  updateCartBadge();
  renderCartModal();
  
  alert('✅ ¡Gracias por tu pedido! Serás redirigido a WhatsApp para confirmar.');
  
  // Limpiar formulario
  document.getElementById('pedido-form').reset();
  
  // Actualizar la página
  initPedidosPage();
}


// --- Funciones del Carrito ---

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart();
  updateCartBadge();
  renderCartModal();
  
  // Animar el carrito
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.style.animation = 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    setTimeout(() => {
      cartBtn.style.animation = '';
    }, 500);
  }
  
  toggleCartModal(true);
}

function updateCartBadge() {
  const cartCount = document.getElementById('cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems > 0) {
    cartCount.innerText = totalItems;
    cartCount.classList.add('active');
  } else {
    cartCount.innerText = '0';
    cartCount.classList.remove('active');
  }
}

function saveCart() {
  localStorage.setItem('sportNutritionCart', JSON.stringify(cart));
}

function toggleCartModal(forceOpen = false) {
  const modalContainer = document.getElementById('cart-modal-container');
  if (forceOpen) {
    modalContainer.classList.add('active');
  } else {
    modalContainer.classList.toggle('active');
  }
}

function renderCartModal() {
  const cartBody = document.getElementById('cart-body');
  const cartFooter = document.getElementById('cart-footer');
  
  if (cart.length === 0) {
      cartBody.innerHTML = '<p class="p-6 text-center text-text-light dark:text-text-dark font-medium">Tu carrito está vacío.</p>';
    cartFooter.classList.add('hidden');
    return;
  }
  
  cartFooter.classList.remove('hidden');
  cartBody.innerHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    const producto = productos.find(p => p.id === item.id); // Asegúrate de que el producto exista
    if (!producto) {
      console.warn(`Producto con ID ${item.id} no encontrado en la base de datos.`);
      return; // Salta este item si no se encuentra el producto
    }
    total += item.quantity * producto.precio_soles;
    
    const itemEl = document.createElement('div');
      itemEl.className = "flex items-center gap-4 p-4 border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark";
    itemEl.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" class="size-16 rounded-lg object-cover">
      <div class="flex-grow">
          <p class="font-bold text-sm text-text-light dark:text-text-dark">${producto.nombre}</p>
          <p class="text-sm text-text-light dark:text-text-dark opacity-80">S/ ${producto.precio_soles.toFixed(2)}</p>
        <div class="flex items-center gap-2 mt-1">
            <button onclick="updateCartItem('${producto.id}', -1)" class="size-6 rounded-full bg-primary/20 text-primary hover:bg-primary/40 transition-colors">−</button>
            <span class="text-text-light dark:text-text-dark font-semibold">${item.quantity}</span>
            <button onclick="updateCartItem('${producto.id}', 1)" class="size-6 rounded-full bg-primary/20 text-primary hover:bg-primary/40 transition-colors">+</button>
        </div>
      </div>
        <p class="font-bold text-text-light dark:text-text-dark">S/ ${(item.quantity * producto.precio_soles).toFixed(2)}</p>
    `;
    cartBody.appendChild(itemEl);
  });
  
  document.getElementById('cart-total').innerText = `S/ ${total.toFixed(2)}`;
}

function updateCartItem(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  
  saveCart();
  updateCartBadge();
  renderCartModal();
  
  // Si estamos en la página de pedidos, actualízala también
  if (document.getElementById('pedido-form')) {
    initPedidosPage();
  }
}
