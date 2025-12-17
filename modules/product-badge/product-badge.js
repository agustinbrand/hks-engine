(function() {
  'use strict';
  
  // Defaults
  const DEFAULTS = {
    position: 'product-name',
    text_before: 'CERTIFICADO POR',
    show_icon: true,
    background: 'linear-gradient(135deg, #26a69a 0%, #4db6ac 100%)',
    text_color: '#ffffff'
  };
  
  // Registrar módulo
  window.HKS_MODULES = window.HKS_MODULES || {};
  
  window.HKS_MODULES['product-badge'] = {
    
    init: function(userConfig) {
      const config = { ...DEFAULTS, ...userConfig };
      
      console.log('[Product Badge] Initializing with config:', config);
      
      // Obtener nombre del producto
      const productName = this.getProductName();
      if (!productName) {
        console.warn('[Product Badge] No se pudo obtener el nombre del producto');
        return;
      }
      
      console.log('[Product Badge] Product name:', productName);
      
      this.injectCSS(config);
      const badge = this.createBadge(config, productName);
      this.insertBadge(badge, config.position);
    },
    
    getProductName: function() {
      // Método 1: TiendaNube expone en window.LS
      if (typeof LS !== 'undefined' && LS.product && LS.product.name) {
        return LS.product.name;
      }
      
      // Método 2: Leer del DOM
      const nameEl = document.querySelector('h1.js-product-name');
      if (nameEl) {
        return nameEl.textContent.trim();
      }
      
      // Método 3: Leer del data-store attribute
      const nameWithAttr = document.querySelector('[data-store*="product-name"]');
      if (nameWithAttr) {
        return nameWithAttr.textContent.trim();
      }
      
      return null;
    },
    
    injectCSS: function(config) {
      if (document.getElementById('hks-product-badge-css')) return;
      
      const style = document.createElement('style');
      style.id = 'hks-product-badge-css';
      style.textContent = `
        .hks-product-badge {
          background: ${config.background};
          color: ${config.text_color};
          padding: 10px 16px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .hks-product-badge__icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }
        
        .hks-product-badge__text {
          line-height: 1.2;
        }
        
        .hks-product-badge__product-name {
          font-weight: 700;
          text-transform: uppercase;
        }
        
        @media (max-width: 768px) {
          .hks-product-badge {
            font-size: 12px;
            padding: 8px 12px;
          }
        }
      `;
      document.head.appendChild(style);
    },
    
    createBadge: function(config, productName) {
      const badge = document.createElement('div');
      badge.className = 'hks-product-badge';
      
      let html = '';
      
      // Icon (opcional)
      if (config.show_icon) {
        html += `
          <svg class="hks-product-badge__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      }
      
      // Text
      html += `
        <span class="hks-product-badge__text">
          ${config.text_before} 
          <span class="hks-product-badge__product-name">${productName}</span>
        </span>
      `;
      
      badge.innerHTML = html;
      return badge;
    },
    
    insertBadge: function(badge, position) {
      const selectors = {
        'product-name': 'h1.js-product-name',
        'product-price': '.js-price-display',
        'add-to-cart': '.js-add-to-cart'
      };
      
      const target = document.querySelector(selectors[position] || selectors['product-name']);
      
      if (!target) {
        console.warn('[Product Badge] Target not found:', position);
        return;
      }
      
      // Insertar ANTES del target
      target.parentNode.insertBefore(badge, target);
      
      console.log('[Product Badge] Badge inserted successfully');
    }
  };
  
})();
