(function() {
  'use strict';
  
  // ============================================
  // Config
  // ============================================
  const SCRIPT_TAG = document.currentScript;
  const CLIENT_ID = SCRIPT_TAG?.dataset.client || window.HKS_CLIENT_ID;
  
  if (!CLIENT_ID) {
    console.warn('[HKS Loader] CLIENT_ID not defined');
    return;
  }
  
  const BASE_URL = 'https://cdn.jsdelivr.net/gh/agustinbrand/hks-engine@main/';
  const CONFIG_URL = BASE_URL + 'clients/' + CLIENT_ID + '/configv3.json';
  
  const CACHE_KEY = 'hks_config_' + CLIENT_ID;
  const CACHE_TTL = 600000; // 10 min
  
  console.log('[HKS Loader] Starting for client:', CLIENT_ID);
  
  // ============================================
  // Cache
  // ============================================
  function getCached() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        return cached.data;
      }
    } catch(e) {}
    return null;
  }
  
  function setCached(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: data,
        ts: Date.now()
      }));
    } catch(e) {
      console.warn('[HKS Loader] Cache failed:', e);
    }
  }
  
  // Force refresh
  if (location.search.includes('hks_refresh=1')) {
    console.log('[HKS Loader] Force refresh detected');
    localStorage.removeItem(CACHE_KEY);
  }
  
  // ============================================
  // Page detection
  // ============================================
  function getPageType() {
    const path = location.pathname;
    if (path.includes('/productos/') || path.includes('/products/')) return 'product';
    if (path.includes('/carrito') || path.includes('/cart')) return 'cart';
    if (path === '/') return 'home';
    if (document.querySelector('.js-category')) return 'category';
    return 'other';
  }
  
  function shouldLoadModule(mod) {
    if (!mod.enabled) {
      console.log('[HKS Loader] Module disabled:', mod.id);
      return false;
    }
    
    const pageType = getPageType();
    console.log('[HKS Loader] Current page type:', pageType);
    
    if (mod.show_on && mod.show_on !== 'all' && mod.show_on !== pageType) {
      console.log('[HKS Loader] Module', mod.id, 'not for this page type');
      return false;
    }
    
    return true;
  }
  
  // ============================================
  // Load config
  // ============================================
  function loadConfig() {
    const cached = getCached();
    if (cached) {
      console.log('[HKS Loader] Using cached config');
      initModules(cached.modules);
      return;
    }
    
    console.log('[HKS Loader] Fetching config from:', CONFIG_URL);
    
    fetch(CONFIG_URL)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Config not found for client: ' + CLIENT_ID);
        }
        return response.json();
      })
      .then(function(data) {
        console.log('[HKS Loader] Config loaded:', data);
        setCached(data);
        initModules(data.modules);
      })
      .catch(function(err) {
        console.error('[HKS Loader] Failed to load config:', err);
      });
  }
  
  function initModules(modules) {
    console.log('[HKS Loader] Initializing', modules.length, 'modules');
    
    modules.forEach(function(mod) {
      if (!shouldLoadModule(mod)) {
        return;
      }
      loadModule(mod);
    });
  }
  
  function loadModule(mod) {
    console.log('[HKS Loader] Loading module:', mod.id);
    
    const script = document.createElement('script');
    script.src = BASE_URL + 'modules/' + mod.id + '/' + mod.id + '.js';
    
    script.onload = function() {
      console.log('[HKS Loader] Module loaded:', mod.id);
      
      if (window.HKS_MODULES && window.HKS_MODULES[mod.id]) {
        console.log('[HKS Loader] Initializing module:', mod.id);
        window.HKS_MODULES[mod.id].init(mod.config || {});
      } else {
        console.warn('[HKS Loader] Module not found in HKS_MODULES:', mod.id);
      }
    };
    
    script.onerror = function() {
      console.error('[HKS Loader] Failed to load module:', mod.id);
    };
    
    document.head.appendChild(script);
  }
  
  // ============================================
  // Start
  // ============================================
  function start() {
    console.log('[HKS Loader] DOM ready, loading config...');
    loadConfig();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  
})();
