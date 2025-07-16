// DOM elements
const themeToggle = document.getElementById("themeToggle");
const portfolioToggle = document.getElementById("portfolioToggle");
const portfolioSectionTitle = document.getElementById("portfolioSectionTitle");
const categoryFilters = document.getElementById("categoryFilters");
const shopContainer = document.getElementById("shopContainer");
const blogContainer = document.getElementById("blogContainer");
const contactModal = document.getElementById("contactModal");
const modalOverlay = contactModal?.querySelector(".modal-overlay");
const modalContainer = contactModal?.querySelector(".modal-container");
const modalClose = document.getElementById("modalClose");
const cancelButton = document.getElementById("cancelButton");
const contactForm = document.getElementById("contactForm");

// Home button elements
const homeButton = document.getElementById("backToHome");
const homeTrigger = document.getElementById("homeTrigger");

// State variables
let isShopMode = false;
let activeFilter = 'All';
let isHomeButtonVisible = false;
let hideHomeButtonTimeout;

// Theme toggle
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");
    const icon = themeToggle.querySelector(".theme-icon");
    if (document.body.classList.contains("light-mode")) {
      icon?.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      icon?.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "dark");
    }
    updateModalTheme();
  });
}

// Check saved theme preference
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.remove("light-mode");
  document.body.classList.add("dark-mode");
  themeToggle?.querySelector(".theme-icon")?.classList.replace("fa-sun", "fa-moon");
}

// Update modal theme based on current theme
function updateModalTheme() {
  const modals = document.querySelectorAll('.modal-container');
  modals.forEach(modal => {
    if (document.body.classList.contains("light-mode")) {
      modal.classList.add('light-mode');
      modal.classList.remove('dark-mode');
    } else {
      modal.classList.add('dark-mode');
      modal.classList.remove('light-mode');
    }
  });
}

// ============ SLIDING HOME BUTTON FUNCTIONS ============

// Show home button
function showHomeButton() {
  if (!homeButton || isHomeButtonVisible) return;
  
  homeButton.classList.add('active');
  isHomeButtonVisible = true;
  
  // Auto-hide after 3 seconds
  clearTimeout(hideHomeButtonTimeout);
  hideHomeButtonTimeout = setTimeout(() => {
    hideHomeButton();
  }, 3000);
}

// Hide home button
function hideHomeButton() {
  if (!homeButton || !isHomeButtonVisible) return;
  
  homeButton.classList.remove('active');
  isHomeButtonVisible = false;
  clearTimeout(hideHomeButtonTimeout);
}

// Initialize home button functionality
function initHomeButton() {
  if (!homeButton || !homeTrigger) return;
  
  // Events for trigger area
  homeTrigger.addEventListener('mouseenter', showHomeButton);
  homeTrigger.addEventListener('touchstart', showHomeButton);
  homeTrigger.addEventListener('click', showHomeButton);
  
  // Events for the button itself
  homeButton.addEventListener('mouseenter', () => {
    clearTimeout(hideHomeButtonTimeout);
  });
  
  homeButton.addEventListener('mouseleave', () => {
    hideHomeButtonTimeout = setTimeout(() => {
      hideHomeButton();
    }, 1000);
  });
  
  // Touch device interactions
  let touchStartX = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });
  
  document.addEventListener('touchmove', (e) => {
    const touchCurrentX = e.touches[0].clientX;
    const touchDiff = touchCurrentX - touchStartX;
    
    // Show button on swipe from left edge
    if (touchStartX < 50 && touchDiff > 30) {
      showHomeButton();
    }
  });
  
  // Show button on scroll up for touch devices
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY < lastScrollY && currentScrollY > 100) {
      // Scrolling up
      if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        homeButton.classList.add('scroll-up');
        setTimeout(() => {
          homeButton.classList.remove('scroll-up');
        }, 2000);
      }
    }
    
    lastScrollY = currentScrollY;
  });
  
  // Show button on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      showHomeButton();
    }
  });
}

// ============ END HOME BUTTON FUNCTIONS ============

// Update section title based on mode
function updateSectionTitle(isShopMode) {
  if (!portfolioSectionTitle) return;
  
  portfolioSectionTitle.style.opacity = '0.5';
  setTimeout(() => {
    portfolioSectionTitle.textContent = isShopMode ? 'Shop' : 'Blog';
    portfolioSectionTitle.style.opacity = '1';
  }, 150);
}

// Filter cards by category
function filterCards(category) {
  activeFilter = category;
  updateCategoryFilters();
  updatePortfolioCards();
}

// Update category filters
function updateCategoryFilters() {
  if (!categoryFilters) return;
  
  const categoryButtons = categoryFilters.querySelectorAll('.category-filter');
  categoryButtons.forEach(button => {
    if (button.dataset.category === activeFilter) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

// Enhanced lazy loading with Intersection Observer
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('.lazy-img');
  if (!lazyImages.length) return;

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.onload = () => {
              img.classList.add('loaded');
              img.removeAttribute('data-src');
              img.parentElement?.classList.remove('image-loading');
            };
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.01
    });
    
    lazyImages.forEach(img => {
      if (img.classList.contains('loaded') || !img.dataset.src) return;
      if (!img.parentElement?.classList.contains('image-loading')) {
        img.parentElement?.classList.add('image-loading');
      }
      imageObserver.observe(img);
    });
  } else {
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
        img.parentElement?.classList.remove('image-loading');
      }
    });
  }
}

// Update portfolio cards
function updatePortfolioCards() {
  if (!shopContainer || !blogContainer) return;

  const allShopCards = document.querySelectorAll('#shopContainer .shop-card');
  const allBlogCards = document.querySelectorAll('#blogContainer .blog-card');

  shopContainer.style.opacity = '0.3';
  blogContainer.style.opacity = '0.3';

  setTimeout(() => {
    if (isShopMode) {
      allShopCards.forEach(card => {
        const categories = card.dataset.category?.split(',') || [];
        if (activeFilter === 'All' || categories.includes(activeFilter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      shopContainer.classList.remove('hidden');
      blogContainer.classList.add('hidden');
    } else {
      allBlogCards.forEach(card => {
        const categories = card.dataset.category?.split(',') || [];
        if (activeFilter === 'All' || categories.includes(activeFilter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      blogContainer.classList.remove('hidden');
      shopContainer.classList.add('hidden');
    }

    shopContainer.style.opacity = '1';
    blogContainer.style.opacity = '1';

    initLazyLoading();
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 150);
}

// Switch portfolio mode
function switchPortfolioMode(isShop) {
  isShopMode = isShop;
  activeFilter = 'All';
  updateSectionTitle(isShopMode);
  updateCategoryFilters();
  updatePortfolioCards();
}

// Portfolio toggle event listener
if (portfolioToggle) {
  portfolioToggle.addEventListener("click", () => {
    isShopMode = !isShopMode;
    const slider = portfolioToggle.querySelector(".portfolio-toggle-slider");
    if (slider) {
      slider.style.transform = isShopMode ? "translateX(32px)" : "translateX(0)";
    }
    portfolioToggle.setAttribute("aria-checked", isShopMode ? "true" : "false");

    switchPortfolioMode(isShopMode);
    localStorage.setItem("portfolioView", isShopMode ? "shop" : "blog");
  });
}

// Contact Modal Functions
function openModal() {
  if (!contactModal || !modalContainer) return;
  
  document.body.style.overflow = 'hidden';
  contactModal.classList.remove('hidden');
  setTimeout(() => {
    modalContainer.classList.add('active');
  }, 10);
}

function closeModal() {
  if (!contactModal || !modalContainer) return;
  
  modalContainer.classList.remove('active');
  setTimeout(() => {
    contactModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 300);
}

// Event listeners for contact buttons
document.querySelectorAll('[data-section="contact"]').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

// Close modal events
modalOverlay?.addEventListener('click', closeModal);
modalClose?.addEventListener('click', closeModal);
cancelButton?.addEventListener('click', closeModal);

// Form submission
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent;
    
    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
        submitButton.classList.add('opacity-75');
      }
      
      // Simulate API call (replace with actual form submission)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      showAlert('success', 'Message sent successfully!');
      contactForm.reset();
      closeModal();
    } catch (error) {
      // Show error message
      showAlert('error', 'Error sending message. Please try again.');
      console.error('Error:', error);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        submitButton.classList.remove('opacity-75');
      }
    }
  });
}

// Show alert message
function showAlert(type, message) {
  const alert = document.createElement('div');
  alert.className = `alert-message alert-${type} flex items-center`;
  alert.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(alert);
  
  // Remove after delay
  setTimeout(() => {
    alert.style.opacity = '0';
    alert.style.transform = 'translateY(-20px)';
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

// Post Image Interaction
function initPostImageInteraction() {
  const postHeroImage = document.getElementById('heroImage');
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  
  // Hero image click functionality
  if (postHeroImage) {
    postHeroImage.addEventListener('click', function(e) {
      e.preventDefault();
      this.classList.toggle('show-content');
      createRippleEffect(e, this);
    });
    
    postHeroImage.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.classList.toggle('show-content');
      }
    });
    
    postHeroImage.setAttribute('tabindex', '0');
    postHeroImage.setAttribute('role', 'button');
    postHeroImage.setAttribute('aria-label', 'Details');
  }
  
  // Scroll to top button visibility
  window.addEventListener('scroll', function() {
    if (scrollToTopBtn) {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }
  });
  
  // Close content when clicking outside
  document.addEventListener('click', function(e) {
    if (postHeroImage && !postHeroImage.contains(e.target)) {
      postHeroImage.classList.remove('show-content');
    }
  });
  
  // Close content on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && postHeroImage) {
      postHeroImage.classList.remove('show-content');
    }
  });
}

// Ripple effect function
function createRippleEffect(event, element) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const ripple = document.createElement('div');
  ripple.className = 'ripple-effect';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

// Scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Initialize home button functionality
  initHomeButton();
  
  // Initialize other components
  updateCategoryFilters();
  updatePortfolioCards();
  initPostImageInteraction();

  if (localStorage.getItem('portfolioView') === 'shop') {
    const slider = portfolioToggle?.querySelector(".portfolio-toggle-slider");
    if (slider) {
      slider.style.transform = "translateX(32px)";
    }
    portfolioToggle?.setAttribute("aria-checked", "true");
    isShopMode = true;
    updateSectionTitle(isShopMode);
    updatePortfolioCards();
  }

  updateModalTheme();

  // Enhanced lazy loading
  const lazyImages = [].slice.call(document.querySelectorAll("img.lazy-img"));
  
  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src || lazyImage.src;
          lazyImage.classList.remove("lazy-img");
          lazyImage.classList.add("loaded");
          lazyImageObserver.unobserve(lazyImage);
          
          const loadingContainer = lazyImage.closest('.image-loading');
          if (loadingContainer) {
            loadingContainer.classList.remove('image-loading');
          }
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('.prose a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Expose functions to global scope
window.filterCards = filterCards;
window.scrollToTop = scrollToTop;
window.showHomeButton = showHomeButton;
window.hideHomeButton = hideHomeButton;

// Enhanced Description Interactive Elements
document.addEventListener('DOMContentLoaded', function() {
  
  // Smooth scroll animations for description blocks
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const blockObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all description blocks for animation
  const descriptionBlocks = document.querySelectorAll('.description-content > div');
  descriptionBlocks.forEach((block, index) => {
    // Set initial state for animation
    block.style.opacity = '0';
    block.style.transform = 'translateY(30px)';
    block.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    
    // Observe for intersection
    blockObserver.observe(block);
  });

  // Enhanced hover effects for feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Enhanced hover effects for benefit cards
  const benefitCards = document.querySelectorAll('.benefit-card');
  benefitCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.02)';
      const icon = this.querySelector('.benefit-icon');
      if (icon) {
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        icon.style.transition = 'transform 0.3s ease';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      const icon = this.querySelector('.benefit-icon');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });

  // Interactive spec items with click to highlight
  const specItems = document.querySelectorAll('.spec-item');
  specItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove highlight from all items
      specItems.forEach(spec => spec.classList.remove('spec-highlighted'));
      
      // Add highlight to clicked item
      this.classList.add('spec-highlighted');
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        this.classList.remove('spec-highlighted');
      }, 3000);
    });
  });

  // Smooth CTA button animation
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    ctaButton.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  }

  // Progressive loading effect for included items
  const includedItems = document.querySelectorAll('.included-item');
  includedItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, index * 100);
    
    // Set initial state
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  // Parallax effect for gradient backgrounds (subtle)
  const gradientBlocks = document.querySelectorAll('.description-features-block, .description-included-block, .description-benefits-block, .description-cta-block');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    gradientBlocks.forEach((block, index) => {
      const rate = scrolled * -0.1;
      block.style.backgroundPosition = `center ${rate}px`;
    });
  });

  // Add ripple effect to clickable elements
  function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  }

  // Apply ripple effect to interactive elements
  const interactiveElements = document.querySelectorAll('.feature-card, .benefit-card, .spec-item, .additional-item, .cta-button');
  interactiveElements.forEach(element => {
    element.addEventListener('click', createRipple);
  });

  // Lazy loading for heavy content blocks
  const heavyBlocks = document.querySelectorAll('.description-features-block, .description-benefits-block');
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded');
        lazyObserver.unobserve(entry.target);
      }
    });
  });

  heavyBlocks.forEach(block => {
    lazyObserver.observe(block);
  });

});

// CSS for additional interactive effects (to be added to the CSS file)
const additionalStyles = `
.spec-highlighted {
  background: linear-gradient(135deg, #28F29C, #20E090) !important;
  color: white !important;
  transform: translateY(-3px) scale(1.02) !important;
  box-shadow: 0 8px 25px rgba(40, 242, 156, 0.4) !important;
}

.spec-highlighted .spec-label,
.spec-highlighted .spec-value {
  color: white !important;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: ripple-animation 0.6s linear;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.loaded {
  animation: fadeInUp 0.8s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Smooth transitions for all interactive elements */
.feature-card,
.benefit-card,
.spec-item,
.additional-item,
.included-item {
  position: relative;
  overflow: hidden;
}

/* Enhanced focus states for accessibility */
.feature-card:focus,
.benefit-card:focus,
.spec-item:focus,
.additional-item:focus,
.cta-button:focus {
  outline: 2px solid #28F29C;
  outline-offset: 2px;
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
