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
      
      anime({
        targets: '.submit-btn',
        scale: [1, 1.1, 1],
        duration: 600,
        easing: 'easeInOutQuad'
      });
      
      // Simulate form submission
      setTimeout(() => {
        alert('¡Mensaje enviado con éxito! Te responderé lo antes posible.');
        contactForm.reset();
      }, 800);
    });
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
    
    // Load project content from index.html in project folder
    fetch(`projects/${projectId}/index.html`)
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
        
        // Load project-specific CSS
        loadProjectCSS(projectId);
        
        // Load project-specific JS
        loadProjectJS(projectId);
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
  
  // Función para cargar CSS específico del proyecto
  function loadProjectCSS(projectId) {
    const existingLink = document.getElementById(`project-${projectId}-css`);
    if (existingLink) return; // Ya está cargado
    
    const link = document.createElement('link');
    link.id = `project-${projectId}-css`;
    link.rel = 'stylesheet';
    link.href = `projects/${projectId}/styles.css`;
    
    document.head.appendChild(link);
  }
  
  // Función para cargar JS específico del proyecto
  function loadProjectJS(projectId) {
    const existingScript = document.getElementById(`project-${projectId}-js`);
    if (existingScript) return; // Ya está cargado
    
    const script = document.createElement('script');
    script.id = `project-${projectId}-js`;
    script.src = `projects/${projectId}/main.js`;
    
    document.body.appendChild(script);
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
});