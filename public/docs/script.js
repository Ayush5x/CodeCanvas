document.addEventListener('DOMContentLoaded', () => {
  const sidebarId = 'sidebar';
  const navbarId = 'header-wrapper';
  let lastScrollTop = 0;
  let wrapper = null;
  let rightPanel = null;

  // Initial UI Setup
  async function init() {
    await loadSharedComponents();
    injectMobileToggle();
    initPageUI();
    
    // Flicker Prevention Cleanup
    setTimeout(() => document.documentElement.classList.remove('no-transition'), 100);
  }

  function injectMobileToggle() {
    if (!document.getElementById('mobile-toggle')) {
      const toggle = document.createElement('button');
      toggle.id = 'mobile-toggle';
      toggle.className = 'mobile-toggle';
      toggle.innerHTML = '☰';
      document.body.appendChild(toggle);
    }
  }

  init();

  async function loadSharedComponents() {
    try {
      const basePath = window.location.pathname.includes('/docs/') ? '/docs/' : '/';
      
      // Load Sidebar if missing
      if (!document.getElementById(sidebarId)) {
        const sidebarRes = await fetch(basePath + 'components/sidebar.html');
        if (sidebarRes.ok) {
          const sidebarHTML = await sidebarRes.text();
          document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
        }
      }

      // Load Navbar if missing
      if (!document.getElementById(navbarId)) {
        const navbarRes = await fetch(basePath + 'components/navbar.html');
        if (navbarRes.ok) {
          const navbarHTML = await navbarRes.text();
          document.body.insertAdjacentHTML('afterbegin', navbarHTML);
          
          // Re-initialize Lucide icons for the new navbar
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
          
          // Re-setup Navbar scroll and dropdown logic
          setupNavbarLogic();
        }
      }
      
      // Initial active link
      updateSidebarActiveLink(window.location.pathname);

    } catch (err) {
      console.error('Error loading components:', err);
    }
  }

  function setupNavbarLogic() {
    const headerWrapper = document.getElementById('header-wrapper');
    const navbarEl = document.getElementById('navbar');
    const trigger = document.getElementById('dropdown-trigger');
    const dropdown = document.getElementById('visualizers-dropdown');
    const chevron = document.getElementById('chevron-icon');
    const themeBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const toggleBtn = document.getElementById('mobile-toggle');

    // 1. Floating Navbar Animation Logic (Handled by Global Scroll Listener)

    // 2. Dropdown Logic
    if (trigger && dropdown) {
      trigger.addEventListener('mouseenter', () => {
        dropdown.classList.add('show');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      });

      trigger.addEventListener('mouseleave', () => {
        dropdown.classList.remove('show');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      });
    }

    // 3. Theme Toggle
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        if (sunIcon) sunIcon.classList.toggle('hidden');
        if (moonIcon) moonIcon.classList.toggle('hidden');
        document.body.style.backgroundColor = isDark ? '#000' : '#fff';
      });
    }

    // 4. Mobile Menu
    if (toggleBtn && mobileMenu) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        
        if (isHidden) {
          mobileMenu.classList.remove('hidden');
          // Force reflow
          void mobileMenu.offsetWidth;
          mobileMenu.classList.add('opacity-100');
          document.body.style.overflow = 'hidden'; // Lock scroll
        } else {
          mobileMenu.classList.remove('opacity-100');
          document.body.style.overflow = ''; // Unlock scroll
          setTimeout(() => {
            if (!mobileMenu.classList.contains('opacity-100')) {
              mobileMenu.classList.add('hidden');
            }
          }, 500);
        }

        if (menuIcon) menuIcon.classList.toggle('hidden');
        if (closeIcon) closeIcon.classList.toggle('hidden');
      });
    }
  }

  // --- SPA ROUTING LOGIC ---
  async function loadPage(url, pushState = true) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    // 1. Prepare/Identify Sub-containers
    let topPagination = mainContent.querySelector('.pagination-top');
    let contentBody = mainContent.querySelector('.page-content-body');

    // If first time, restructure main-content to isolate pagination
    if (!contentBody) {
      contentBody = document.createElement('div');
      contentBody.className = 'page-content-body';
      
      // Move all elements after top pagination into contentBody
      const nodes = Array.from(mainContent.childNodes);
      let foundTopPag = false;
      nodes.forEach(node => {
        if (node === topPagination) {
          foundTopPag = true;
          return;
        }
        if (foundTopPag) {
          contentBody.appendChild(node);
        }
      });
      mainContent.appendChild(contentBody);
    }

    // 2. Start Transition (Only on body)
    contentBody.classList.add('loading');

    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const html = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newMain = doc.querySelector('.main-content');

      if (newMain && mainContent) {
        // Update Title
        document.title = doc.title;

        // Extract New Content parts
        const newTopPagination = newMain.querySelector('.pagination-top');
        
        // Remove the top pagination from newMain so we can grab the rest
        if (newTopPagination) newTopPagination.remove();
        
        // Update Top Pagination (Update stable element)
        if (topPagination && newTopPagination) {
          topPagination.innerHTML = newTopPagination.innerHTML;
        }

        // Update Content Body
        contentBody.innerHTML = newMain.innerHTML;
        
        // Reset Scroll
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Re-initialize UI
        initPageUI();
        updateSidebarActiveLink(url);

        if (pushState) {
          history.pushState({ url }, doc.title, url);
        }

        setTimeout(() => {
          contentBody.classList.remove('loading');
        }, 50);
      }
    } catch (error) {
      console.error('Failed to load page:', error);
      contentBody.classList.remove('loading');
      if (pushState) window.location.href = url;
    }
  }

  function updateSidebarActiveLink(url) {
    // Normalize url to get just the filename
    const fileName = url.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      const linkHref = link.getAttribute('href');
      if (linkHref === fileName || (fileName === '' && linkHref === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // Intercept all clicks on internal doc links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

    const isSameOrigin = link.origin === window.location.origin;
    const isDocLink = link.pathname.includes('/docs');
    const isHtmlFile = link.pathname.endsWith('.html');
    const isDocRoot = link.pathname.endsWith('/docs') || link.pathname.endsWith('/docs/');
    
    if (isSameOrigin && isDocLink && (isHtmlFile || isDocRoot)) {
      e.preventDefault();
      loadPage(link.pathname);
    }
  });

  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.url) {
      loadPage(e.state.url, false);
    } else {
      loadPage(window.location.pathname, false);
    }
  });

  // --- UI INITIALIZATION LOGIC ---
  function initPageUI() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    // 1. Setup Wrapper and Right Panel if not present
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'content-wrapper';
      mainContent.parentNode.insertBefore(wrapper, mainContent);
      wrapper.appendChild(mainContent);
    } else {
      if (mainContent.parentNode !== wrapper) {
        wrapper.appendChild(mainContent);
      }
    }

    if (!rightPanel) {
      rightPanel = document.createElement('aside');
      rightPanel.className = 'right-panel';
      wrapper.appendChild(rightPanel);
    }

    // 2. Clear and Rebuild TOC
    rightPanel.innerHTML = '';
    
    // Calculate Reading Time
    const textContent = mainContent.innerText || mainContent.textContent;
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Build TOC Content
    const headings = mainContent.querySelectorAll('h2');
    let tocHTML = `
      <div style="margin-bottom: 1rem;">
        <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">⏱️ ${readingTime} min read</span>
      </div>
      <h3>On This Page</h3><ul>`;
      
    if (headings.length > 0) {
      headings.forEach((h2, index) => {
        const id = `heading-${index}`;
        h2.id = id;
        tocHTML += `<li><a href="#${id}">${h2.textContent}</a></li>`;
      });
    } else {
      tocHTML += '<li><a href="#">Top of Page</a></li>';
    }
    tocHTML += '</ul>';

    const dsaFacts = [
      "Dijkstra initially conceived his algorithm in just 20 minutes while drinking coffee at a cafe.",
      "The first hash function was created by Hans Peter Luhn in 1953 at IBM.",
      "Merge Sort was invented by John von Neumann in 1945.",
      "The term 'Dynamic Programming' was coined by Richard Bellman to hide the mathematical research from his boss.",
      "Quicksort was developed by Tony Hoare in 1959 while trying to translate Russian into English."
    ];
    const randomFact = dsaFacts[Math.floor(Math.random() * dsaFacts.length)];

    tocHTML += `
      <div style="margin-top: 1rem;">
        <div class="creative-card">
          <h4 style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 0.5rem;">💡 Did you know?</h4>
          <p id="fact-text" style="font-size: 0.85rem; transition: opacity 0.3s ease;">${randomFact}</p>
        </div>
      </div>
      <div style="margin-top: 1rem;">
        <div class="creative-card" style="border-color: #333;">
          <p style="font-size: 0.85rem;">Want to see these algorithms in action?</p>
          <a href="/dsa" class="btn" style="padding: 0.5rem 1rem; font-size: 0.85rem; border-radius: 30px;">Interactive Visualizers</a>
        </div>
      </div>
    `;

    rightPanel.innerHTML = tocHTML;

    // Re-attach Focus Button
    initFocusControls();

    // Smooth scrolling for TOC links
    rightPanel.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const y = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  // Focus Controls Setup
  function initFocusControls() {
    let focusContainer = document.getElementById('focus-container');
    if (!focusContainer) {
      focusContainer = document.createElement('div');
      focusContainer.id = 'focus-container';
      focusContainer.style.cssText = 'display: flex; justify-content: center; background: rgba(10, 20, 16, 0.8); padding: 0.4rem; border-radius: 40px; border: 1px solid var(--accent-green); box-shadow: 0 4px 15px rgba(0,0,0,0.3); margin-bottom: -1rem;';
      
      const focusBtn = document.createElement('button');
      focusBtn.id = 'focus-toggle-btn';
      focusBtn.innerHTML = '🎯 Focus';
      focusBtn.style.cssText = 'background: transparent; border: none; color: var(--text-muted); border-radius: 30px; padding: 0.4rem 1.5rem; cursor: pointer; transition: all 0.3s; font-size: 0.85rem; font-weight: 600; width: 100%;';
      
      focusContainer.appendChild(focusBtn);
      
      focusBtn.addEventListener('click', toggleFocus);
    }

    if (rightPanel) {
      rightPanel.insertBefore(focusContainer, rightPanel.firstChild);
    }

    const isFocusActive = localStorage.getItem('focus-mode') === 'hide';
    if (isFocusActive) {
      applyFocusState(true);
    } else {
      applyFocusState(false);
    }
  }

  function toggleFocus() {
    const isActive = localStorage.getItem('focus-mode') === 'hide';
    applyFocusState(!isActive);
    if (!isActive) {
      localStorage.setItem('focus-mode', 'hide');
    } else {
      localStorage.removeItem('focus-mode');
    }
  }

  function applyFocusState(active) {
    const focusBtn = document.getElementById('focus-toggle-btn');
    const focusContainer = document.getElementById('focus-container');
    const sidebar = document.getElementById('sidebar');
    if (!focusBtn || !focusContainer) return;

    if (active) {
      document.documentElement.classList.add('focus-hide');
      if (sidebar) sidebar.classList.add('focus-hide');
      if (rightPanel) rightPanel.classList.add('focus-hide');
      if (wrapper) wrapper.classList.add('focus-expand');
      
      const headerWrapper = document.getElementById('header-wrapper');
      if (headerWrapper) headerWrapper.style.display = 'none';
      
      focusBtn.style.background = 'var(--accent-green)';
      focusBtn.style.color = '#000';
      focusBtn.innerHTML = '🔓 Exit Focus';
      
      focusContainer.style.position = 'fixed';
      focusContainer.style.top = '1.5rem';
      focusContainer.style.right = '2rem';
      focusContainer.style.zIndex = '10001';
      document.body.appendChild(focusContainer);
    } else {
      document.documentElement.classList.remove('focus-hide');
      if (sidebar) sidebar.classList.remove('focus-hide');
      if (rightPanel) rightPanel.classList.remove('focus-hide');
      if (wrapper) wrapper.classList.remove('focus-expand');
      
      const headerWrapper = document.getElementById('header-wrapper');
      if (headerWrapper) headerWrapper.style.display = 'block';
      
      focusBtn.style.background = 'transparent';
      focusBtn.style.color = 'var(--text-muted)';
      focusBtn.innerHTML = '🎯 Focus';
      
      focusContainer.style.position = 'static';
      focusContainer.style.marginBottom = '-1rem';
      if (rightPanel) rightPanel.insertBefore(focusContainer, rightPanel.firstChild);
    }
  }

  // Global Scroll Behavior (Floating Navbar only)
  window.addEventListener('scroll', () => {
    const headerWrapper = document.getElementById('header-wrapper');
    const navbarEl = document.getElementById('navbar');
    const currentScrollY = window.scrollY;

    if (currentScrollY > 20) {
      if (headerWrapper) headerWrapper.style.padding = "16px 16px 0";
      if (navbarEl) {
        navbarEl.classList.add('max-w-[900px]', 'rounded-full', 'border', 'border-white/10', 'bg-neutral-900/80', 'shadow-2xl');
        navbarEl.classList.remove('max-w-full', 'bg-black', 'border-transparent');
      }
    } else {
      if (headerWrapper) headerWrapper.style.padding = "0";
      if (navbarEl) {
        navbarEl.classList.remove('max-w-[900px]', 'rounded-full', 'border', 'border-white/10', 'bg-neutral-900/80', 'shadow-2xl');
        navbarEl.classList.add('max-w-full', 'bg-black', 'border-transparent');
      }
    }
  }, { passive: true });

  // Sidebar toggle logic
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('mobile-toggle');
    if (window.innerWidth <= 900 && sidebar && !sidebar.contains(e.target) && !e.target.closest('#mobile-toggle')) {
      sidebar.classList.remove('open');
    } else if (e.target.closest('#mobile-toggle')) {
      if (sidebar) sidebar.classList.toggle('open');
    }
  });
});

