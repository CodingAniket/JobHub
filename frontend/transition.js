// Add page transition class to main content
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    if (main) {
      main.classList.add('page-transition');
    }
  });
  
  // Handle link clicks for smooth transitions
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin)) {
      e.preventDefault();
      
      const main = document.querySelector('main');
      if (main) {
        main.style.opacity = '0';
        main.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          window.location.href = link.href;
        }, 300);
      }
    }
  });