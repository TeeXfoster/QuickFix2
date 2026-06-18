/* ============================================
   QuickFix - Vanilla JS (Part 3)
   Features:
   - Smooth transitions
   - Modal
   - Tabs
   - Accordion
   - Lightbox gallery
   - Live search filtering
   - Client-side validation (instant errors)
   - Enquiry form response (availability + estimated cost)
   - Contact form validation + AJAX simulation + mailto compilation
   ============================================ */

(() => {
  "use strict";

  // ---------- Utilities ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function requiredTrim(el) {
    return (el?.value || "").trim();
  }

  function setFieldError(inputEl, message) {
    if (!inputEl) return;

    const form = inputEl.closest("form") || document;
    const errorEl = form.querySelector(
      `[data-error-for="${CSS.escape(inputEl.name || inputEl.id)}"]`
    );
    const fieldWrap = inputEl.closest("p") || inputEl.parentElement;

    const invalid = Boolean(message);
    inputEl.setAttribute("aria-invalid", invalid ? "true" : "false");

    if (errorEl) {
      errorEl.textContent = message || "";
      errorEl.style.display = invalid ? "block" : "none";
    }

    if (fieldWrap) {
      fieldWrap.classList.toggle("has-error", invalid);
      fieldWrap.classList.toggle(
        "has-success",
        !invalid && requiredTrim(inputEl).length > 0
      );
    }
  }

  function isValidName(name) {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ'\- ]{2,}$/.test(name.trim());
  }

  function normalizePhone(raw) {
    return raw.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
  }

  function isValidPhone(phone) {
    const p = normalizePhone(phone);
    return /^(\+27|0)\d{9}$/.test(p);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }

  function showToast(message) {
    let toast = $("#quickfix-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "quickfix-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.style.position = "fixed";
      toast.style.left = "50%";
      toast.style.bottom = "24px";
      toast.style.transform = "translateX(-50%)";
      toast.style.background = "rgba(20,90,158,0.95)";
      toast.style.color = "#fff";
      toast.style.padding = "12px 16px";
      toast.style.borderRadius = "10px";
      toast.style.boxShadow = "0 8px 30px rgba(0,0,0,0.25)";
      toast.style.zIndex = "9999";
      toast.style.display = "none";
      toast.style.maxWidth = "90vw";
      toast.style.fontFamily = "inherit";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.display = "block";

    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.style.display = "none";
    }, 3500);
  }

  // ---------- Modal ----------
  function initModals() {
    const modalEls = $$('[data-modal]');
    if (!modalEls.length) return;

    const openers = $$('[data-open-modal]');

    const modalClose = (modal) => {
      if (!modal) return;
      modal.setAttribute("aria-hidden", "true");
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    const modalOpen = (modal, openerBtn) => {
      if (!modal) return;
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";

      const closeBtn = modal.querySelector("[data-close-modal]");
      closeBtn?.focus?.();
      modal._lastFocus = openerBtn || document.activeElement;
    };

    openers.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute("data-open-modal");
        const modal = targetId ? document.getElementById(targetId) : null;
        modalOpen(modal, btn);
      });
    });

    modalEls.forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modalClose(modal);
      });

      const closeBtn = modal.querySelector("[data-close-modal]");
      closeBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        modalClose(modal);
        modal._lastFocus?.focus?.();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        const isOpen =
          modal.getAttribute("aria-hidden") === "false" ||
          modal.classList.contains("is-open");
        if (isOpen) {
          modalClose(modal);
          modal._lastFocus?.focus?.();
        }
      });
    });
  }

  // ---------- Tabs ----------
  function initTabs() {
    const tabsRoot = $("[data-tabs]");
    if (!tabsRoot) return;

    const tabButtons = $$('[data-tab-button]', tabsRoot);
    const panels = $$('[data-tab-panel]', tabsRoot);
    if (!tabButtons.length || !panels.length) return;

    const activate = (btn) => {
      const panelId = btn.getAttribute("data-tab-button");
      if (!panelId) return;

      tabButtons.forEach((b) => {
        const active = b === btn;
        b.setAttribute("aria-selected", active ? "true" : "false");
        b.tabIndex = active ? 0 : -1;
        b.classList.toggle("is-active", active);
      });

      panels.forEach((p) => {
        const show = p.getAttribute("data-tab-panel") === panelId;
        p.hidden = !show;
      });
    };

    tabButtons.forEach((btn, idx) => {
      btn.addEventListener("click", () => activate(btn));
      btn.addEventListener("keydown", (e) => {
        const i = tabButtons.indexOf(btn);
        if (e.key === "ArrowRight") {
          activate(tabButtons[clamp(i + 1, 0, tabButtons.length - 1)]);
        }
        if (e.key === "ArrowLeft") {
          activate(tabButtons[clamp(i - 1, 0, tabButtons.length - 1)]);
        }
      });
      if (idx === 0) activate(btn);
    });
  }

  // ---------- Accordion ----------
  function initAccordion() {
    const roots = $$('[data-accordion]');
    if (!roots.length) return;

    roots.forEach((root) => {
      const items = $$('[data-accordion-item]', root);
      items.forEach((item) => {
        const headerBtn = item.querySelector("[data-accordion-toggle]");
        const panel = item.querySelector("[data-accordion-panel]");
        if (panel) panel.hidden = true;

        item.setAttribute("data-open", "false");

        headerBtn?.addEventListener("click", (e) => {
          e.preventDefault();
          const isOpen = item.getAttribute("data-open") === "true";

          // close siblings
          items.forEach((it) => {
            it.setAttribute("data-open", "false");
            it.classList.remove("is-open");
            const p = it.querySelector("[data-accordion-panel]");
            if (p) p.hidden = true;
          });

          if (!isOpen) {
            item.setAttribute("data-open", "true");
            item.classList.add("is-open");
            if (panel) panel.hidden = false;
          }
        });
      });
    });
  }

  // ---------- Lightbox ----------
  function initLightbox() {
    const galleryRoot = $("[data-lightbox-gallery]");
    if (!galleryRoot) return;

    const thumbs = $$('[data-lightbox-thumb]', galleryRoot);
    if (!thumbs.length) return;

    const lightbox = $("#quickfix-lightbox");
    if (!lightbox) return;

    const imgEl = $("#quickfix-lightbox-img", lightbox);
    const captionEl = $("#quickfix-lightbox-caption", lightbox);
    const closeBtn = $("[data-close-lightbox]", lightbox);

    const open = (src, caption) => {
      if (!imgEl) return;
      imgEl.src = src;
      imgEl.alt = caption || "Gallery image";
      if (captionEl) captionEl.textContent = caption || "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    thumbs.forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        open(
          a.getAttribute("data-lightbox-src") || a.href,
          a.getAttribute("data-lightbox-caption") || a.getAttribute("aria-label") || ""
        );
      });
    });

    closeBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      close();
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) close();
    });
  }

  // ---------- Live service search filtering ----------
  function initServiceSearch() {
    const input = $("[data-service-search]");
    const listRoot = $("[data-service-list]");
    if (!input || !listRoot) return;

    const items = $$('[data-service-item]', listRoot);
    const resultEl = $("[data-search-results]");

    const norm = (s) => (s || "").toLowerCase().trim();

    const filter = () => {
      const q = norm(input.value);
      let count = 0;

      items.forEach((it) => {
        const key = norm(it.getAttribute("data-service") || "");
        const text = norm(it.textContent || "");
        const match = q === "" || key.includes(q) || text.includes(q);
        it.hidden = !match;
        if (match) count++;
      });

      if (resultEl) resultEl.textContent = q ? `${count} matching service(s)` : "";
    };

    input.addEventListener("input", filter);
    filter();
  }

  // ---------- Enquiry form ----------
  const SERVICE_RULES = {
    electricians: { base: 650, availability: "High" },
    gardeners: { base: 450, availability: "Medium" },
    mechanics: { base: 750, availability: "Medium" },
    plumbing: { base: 600, availability: "High" },
    phone: { base: 400, availability: "High" },
    extras: { base: 500, availability: "High" }
  };

  function initEnquiryForm() {
    const form = $("form[data-enquiry-form]");
    if (!form) return;

    const serviceSel = form.querySelector("select[name='service']");
    const nameEl = form.querySelector("input[name='name']");
    const phoneEl = form.querySelector("input[name='phone']");
    const emailEl = form.querySelector("input[name='email']");
    const resp = form.querySelector("[data-enquiry-response]");

    const validate = () => {
      let ok = true;

      const requiredFields = [nameEl, phoneEl, emailEl];
      requiredFields.forEach((el) => {
        if (!el) return;
        if (!requiredTrim(el)) {
          setFieldError(el, "This field is required.");
          ok = false;
        } else {
          setFieldError(el, "");
        }
      });

      if (nameEl && requiredTrim(nameEl) && !isValidName(requiredTrim(nameEl))) {
        setFieldError(nameEl, "Enter a valid full name." );
        ok = false;
      }
      if (phoneEl && requiredTrim(phoneEl) && !isValidPhone(requiredTrim(phoneEl))) {
        setFieldError(phoneEl, "Enter a valid South African phone number (e.g. 0712345678)." );
        ok = false;
      }
      if (emailEl && requiredTrim(emailEl) && !isValidEmail(requiredTrim(emailEl))) {
        setFieldError(emailEl, "Enter a valid email address." );
        ok = false;
      }

      return ok;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) {
        showToast("Fix the highlighted fields.");
        return;
      }

      const serviceValue = serviceSel ? serviceSel.value : "";
      const name = requiredTrim(nameEl);

      const rule = SERVICE_RULES[serviceValue] || { base: 500, availability: "Medium" };
      const variation = (name.length % 6) * 25;
      const estimate = rule.base + variation;

      const availabilityText = (rule.availability || "Medium").toLowerCase();
      const msg = `Thanks, ${name}! We have ${availabilityText} availability for ${serviceValue || "your service"}. Estimated cost: R${estimate}.`;

      if (resp) {
        resp.textContent = msg;
        resp.style.display = "block";
      }

      showToast("Enquiry submitted. Check the response message.");
    });
  }

  // ---------- Contact form ----------
  function initContactForm() {
    const form = $("form[data-contact-form]");
    if (!form) return;

    const nameEl = form.querySelector("input[name='name']");
    const phoneEl = form.querySelector("input[name='phone']");
    const emailEl = form.querySelector("input[name='email']");
    const messageEl = form.querySelector("textarea[name='message']");
    const respEl = form.querySelector("[data-contact-response]");

    const validate = () => {
      let ok = true;
      const requiredFields = [nameEl, phoneEl, emailEl, messageEl].filter(Boolean);

      requiredFields.forEach((el) => {
        if (!requiredTrim(el)) {
          setFieldError(el, "This field is required.");
          ok = false;
        } else {
          setFieldError(el, "");
        }
      });

      if (nameEl && requiredTrim(nameEl) && !isValidName(requiredTrim(nameEl))) {
        setFieldError(nameEl, "Enter a valid full name." );
        ok = false;
      }
      if (phoneEl && requiredTrim(phoneEl) && !isValidPhone(requiredTrim(phoneEl))) {
        setFieldError(phoneEl, "Enter a valid South African phone number." );
        ok = false;
      }
      if (emailEl && requiredTrim(emailEl) && !isValidEmail(requiredTrim(emailEl))) {
        setFieldError(emailEl, "Enter a valid email address." );
        ok = false;
      }
      if (messageEl && requiredTrim(messageEl) && requiredTrim(messageEl).length < 10) {
        setFieldError(messageEl, "Message must be at least 10 characters." );
        ok = false;
      }

      return ok;
    };

    const buildMailto = ({ name, phone, email, message }) => {
      const to = "tshedzafoster@gmail.com";
      const subject = `QuickFix message from ${name}`;
      const body = [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        "",
        "Message:",
        message
      ].join("\n");

      return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validate()) {
        showToast("Please correct the highlighted fields.");
        return;
      }

      const submitBtn = form.querySelector("button[type='submit'], input[type='submit']");
      if (submitBtn) submitBtn.disabled = true;

      if (respEl) {
        respEl.textContent = "Sending message (AJAX demo)...";
        respEl.style.display = "block";
      }

      await new Promise((r) => setTimeout(r, 650));

      const payload = {
        name: requiredTrim(nameEl),
        phone: requiredTrim(phoneEl),
        email: requiredTrim(emailEl),
        message: requiredTrim(messageEl)
      };

      const mailto = buildMailto(payload);

      if (respEl) {
        respEl.textContent = "Success! Your email client will open with your message.";
      }

      showToast("Opening your email client...");
      window.location.href = mailto;

      if (submitBtn) submitBtn.disabled = false;
    });
  }

  // ---------- Global enhancements ----------
  function initGlobalEnhancements() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;

      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", hash);
    });
  }

  function init() {
    initGlobalEnhancements();
    initModals();
    initTabs();
    initAccordion();
    initLightbox();
    initServiceSearch();
    initEnquiryForm();
    initContactForm();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

