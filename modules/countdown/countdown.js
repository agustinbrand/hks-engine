(function () {
  'use strict';

  const DEFAULTS = {
    mode: 'daily',                    // fixed | personal | daily
    text: '3x2 EN TODO:',
    fixed_date: '2025-12-31 23:59:59',
    personal_minutes: 15,
    show_days: false,
    position: 'header',               // header | product | cart
    sticky: false,
    secondary_position: null,          // null | cart-submit
    background: 'linear-gradient(135deg,#dc3545 0%,#dc3545 100%)'
  };

  window.HKS_MODULES = window.HKS_MODULES || {};

  window.HKS_MODULES.countdown = {
    init(userConfig) {
      const config = { ...DEFAULTS, ...userConfig };

      this.config = config;
      this.endTime = 0;

      this.injectCSS(config);
      this.createBase();
      this.calculateEndTime();
      this.insert();
      this.update();
      setInterval(() => this.update(), 1000);
    },

    /* ================= CSS ================= */
    injectCSS(config) {
      if (document.getElementById('hks-countdown-css')) return;

      const style = document.createElement('style');
      style.id = 'hks-countdown-css';
      style.textContent = `
        .hks-countdown-bar {
          background: ${config.background};
          color: #fff;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,.1);
          z-index: 999;
          width: 100%;
          transition: all .3s ease;
          padding: 12px 18px;
        }
        .hks-countdown-bar.sticky { position: sticky; top: 0; }
        .hks-countdown-content {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }
        .hks-countdown-text {
          font-weight: 700;
          text-transform: uppercase;
        }
        .hks-countdown-timer {
          display: flex;
          gap: 6px;
        }
        .hks-countdown-unit {
          background: rgba(255,255,255,.2);
          padding: 6px 10px;
          border-radius: 8px;
          min-width: 42px;
        }
        .hks-countdown-number {
          font-weight: 700;
          font-size: 16px;
        }
        .hks-countdown-label {
          font-size: 10px;
          opacity: .9;
        }
      `;
      document.head.appendChild(style);
    },

    /* ================= DOM ================= */
    createBase() {
      this.el = document.createElement('div');
      this.el.className = 'hks-countdown-bar';
      if (this.config.sticky && this.config.position === 'header') {
        this.el.classList.add('sticky');
      }

      this.el.innerHTML = `
        <div class="hks-countdown-content">
          <span class="hks-countdown-text">${this.config.text}</span>
          <div class="hks-countdown-timer"></div>
        </div>
      `;

      this.timerEl = this.el.querySelector('.hks-countdown-timer');
    },

    insert() {
      const map = {
        header: 'header.js-head-main',
        product: '.js-product-name',
        cart: 'button.js-add-to-cart'
      };

      const target = document.querySelector(map[this.config.position]);
      if (!target || !target.parentNode) return;

      target.parentNode.insertBefore(this.el, target);
    },

    /* ================= TIME ================= */
    calculateEndTime() {
      const now = Date.now();

      if (this.config.mode === 'fixed') {
        this.endTime = new Date(this.config.fixed_date).getTime();
      } else if (this.config.mode === 'personal') {
        this.endTime = now + this.config.personal_minutes * 60 * 1000;
      } else {
        const t = new Date();
        t.setHours(24, 0, 0, 0);
        this.endTime = t.getTime();
      }
    },

    update() {
      const now = Date.now();
      let diff = this.endTime - now;

      if (diff <= 0) {
        this.calculateEndTime();
        diff = this.endTime - now;
      }

      let d = Math.floor(diff / (1000 * 60 * 60 * 24));
      let h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      let m = Math.floor((diff / (1000 * 60)) % 60);
      let s = Math.floor((diff / 1000) % 60);

      if (!this.config.show_days) {
        h += d * 24;
        d = 0;
      }

      this.render(d, h, m, s);
    },

    render(d, h, m, s) {
      const pad = n => (n < 10 ? '0' + n : n);

      this.timerEl.innerHTML = `
        ${this.config.show_days ? `<div class="hks-countdown-unit"><div class="hks-countdown-number">${pad(d)}</div><div class="hks-countdown-label">Días</div></div>` : ''}
        <div class="hks-countdown-unit"><div class="hks-countdown-number">${pad(h)}</div><div class="hks-countdown-label">Hs</div></div>
        <div class="hks-countdown-unit"><div class="hks-countdown-number">${pad(m)}</div><div class="hks-countdown-label">Min</div></div>
        <div class="hks-countdown-unit"><div class="hks-countdown-number">${pad(s)}</div><div class="hks-countdown-label">Seg</div></div>
      `;
    }
  };

})();
