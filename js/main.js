document.addEventListener('DOMContentLoaded', function() {
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hero title animation
  anime({
    targets: '.hero-title',
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 1000,
    easing: 'easeOutQuad',
    delay: 300
  });
  
  anime({
    targets: '.hero-subtitle',
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 1000,
    easing: 'easeOutQuad',
    delay: 600
  });
  
  anime({
    targets: '.hero-btns',
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 1000,
    easing: 'easeOutQuad',
    delay: 900
  });
  
  // Scroll down animation
  anime({
    targets: '.scroll-down',
    opacity: [0, 1],
    duration: 1000,
    delay: 1500
  });

  // Scroll animations
  function animateOnScroll() {
    const aboutImg = document.querySelector('.about-img');
    const aboutText = document.querySelector('.about-text');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.querySelector('.contact-form');
    
    // About section
    if (isElementInViewport(aboutImg)) {
      aboutImg.classList.add('animate');
      aboutText.classList.add('animate');
    }
    
    // Project cards
    projectCards.forEach((card, index) => {
      if (isElementInViewport(card)) {
        setTimeout(() => {
          card.classList.add('animate');
        }, 150 * index);
      }
    });
    
    // Contact form
    if (isElementInViewport(contactForm)) {
      contactForm.classList.add('animate');
    }
    
    // Skill bars animation
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
      if (isElementInViewport(bar) && !bar.hasAttribute('data-animated')) {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
        bar.setAttribute('data-animated', 'true');
      }
    });
  }
  
  // Check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  }
  
  // Initial check
  animateOnScroll();
  
  // Listen for scroll events
  window.addEventListener('scroll', animateOnScroll);
  
  // Nav link active state
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', function() {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= (sectionTop - 100)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
  
  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Animación del botón
      anime({
        targets: '.submit-btn',
        scale: [1, 1.1, 1],
        duration: 600,
        easing: 'easeInOutQuad'
      });
      
      // Obtener datos del formulario
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();
      
      if (name && email && message) {
        // Crear objeto con los datos
        const formData = {
          name,
          email,
          subject: subject || "Sin asunto",
          message,
          date: new Date().toLocaleString()
        };
        
        // Guardar datos en localStorage como respaldo
        saveToLocalStorage(formData);
        
        // Intentar enviar al servidor
        sendFormData(formData);
      } else {
        alert('Por favor complete todos los campos requeridos (Nombre, Email y Mensaje)');
      }
    });
  }

  // Función para guardar en localStorage
  function saveToLocalStorage(data) {
    try {
      // Obtener datos existentes o crear nuevo array
      const existingData = JSON.parse(localStorage.getItem('contactFormSubmissions')) || [];
      
      // Agregar nuevo dato
      existingData.push(data);
      
      // Guardar en localStorage
      localStorage.setItem('contactFormSubmissions', JSON.stringify(existingData));
      
      console.log('Datos guardados en localStorage');
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  // Función para enviar datos a Formspree
  function sendFormData(data) {
    // Tu endpoint personalizado de Formspree
    const formspreeEndpoint = 'https://formspree.io/f/xblkovrp';
    
    // Mostrar animación de carga en el botón
    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        _replyto: data.email,
        _format: 'plain',
        _captcha: 'false'
      })
    })
    .then(response => {
      if (response.ok) {
        // Mostrar alerta de éxito
        showAlert('¡Mensaje enviado con éxito! Te responderé lo antes posible.', 'success');
        // Resetear formulario
        contactForm.reset();
      } else {
        return response.json().then(err => {
          throw new Error(err.error || 'Error en la respuesta del servidor');
        });
      }
    })
    .catch(error => {
      console.error('Error al enviar el formulario:', error);
      showAlert('El mensaje se ha guardado localmente. Intentaré enviarlo cuando recupere la conexión.', 'warning');
    })
    .finally(() => {
      // Restaurar el botón a su estado original
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    });
  }

  // Función para mostrar alertas personalizadas
  function showAlert(message, type = 'success') {
    // Eliminar alertas existentes
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) existingAlert.remove();
    
    // Crear elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert alert-${type}`;
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      max-width: 400px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease-out;
    `;
    alertDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
        <span>${message}</span>
        <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    
    // Agregar al cuerpo
    document.body.appendChild(alertDiv);
    
    // Configurar para que desaparezca automáticamente
    setTimeout(() => {
      alertDiv.style.animation = 'fadeOut 0.5s ease-out forwards';
      setTimeout(() => {
        if (alertDiv.parentNode) alertDiv.parentNode.removeChild(alertDiv);
      }, 500);
    }, 5000);
  }

  // Project details modal functionality
  const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
  const projectDetailContent = document.getElementById('projectDetailContent');
  
  // Add event listeners to all "View Project" buttons
  document.querySelectorAll('.view-project').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const projectId = this.getAttribute('data-project');
      loadProjectDetails(projectId);
    });
  });
  
  // Function to load project details
  function loadProjectDetails(projectId) {
    // Show loading indicator
    projectDetailContent.innerHTML = '<div class="loading-spinner"></div>';
    projectDetailContent.classList.add('loading');
    
    // Load project content from external file
    fetch(`projects/${projectId}.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(html => {
        // Insert content and show modal
        projectDetailContent.innerHTML = html;
        projectDetailContent.classList.remove('loading');
        projectModal.show();
        
        // Add animation to the loaded content
        anime({
          targets: '.project-detail-content',
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 800,
          easing: 'easeOutQuad'
        });
      })
      .catch(error => {
        console.error('Error loading project details:', error);
        projectDetailContent.innerHTML = `
          <div class="text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h3>Error al cargar el proyecto</h3>
            <p>Lo sentimos, no se pudo cargar la información del proyecto. Por favor, inténtalo de nuevo más tarde.</p>
            <button class="btn btn-primary mt-3" onclick="location.reload()">Recargar</button>
          </div>
        `;
        projectDetailContent.classList.remove('loading');
        projectModal.show();
      });
  }
  
  // Project cards hover effect
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      anime({ 
        targets: card, 
        scale: 1.03, 
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
    card.addEventListener('mouseleave', () => {
      anime({ 
        targets: card, 
        scale: 1, 
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
  });
  
  // Añadir estilos para las alertas
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});