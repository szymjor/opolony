/* Auto Centrum Opolony — frontend interactions */
(function () {
  'use strict';

  // ---------- Sticky header shadow on scroll ----------
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu toggle ----------
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav--open');
      toggle.classList.toggle('is-active', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        toggle.classList.remove('is-active');
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // ---------- Reveal on scroll (lekka animacja) ----------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
      '.service-card, .why-card, .step, .badge-strip, .contact-dept, .hero__pill, .about__body, .about__media, .form-card'
    ).forEach((el) => {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // ---------- Formularz kontaktowy ----------
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (form && feedback && submitBtn) {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      feedback.className = 'form-feedback';
      feedback.textContent = '';

      const fd = new FormData(form);
      const payload = {
        name: (fd.get('name') || '').toString().trim(),
        phone: (fd.get('phone') || '').toString().trim(),
        email: (fd.get('email') || '').toString().trim(),
        subject: (fd.get('subject') || '').toString().trim(),
        message: (fd.get('message') || '').toString().trim(),
        consent: !!fd.get('consent')
      };

      // Walidacja front-end
      if (!payload.name || payload.name.length < 2) {
        feedback.className = 'form-feedback err';
        feedback.textContent = 'Podaj imię i nazwisko.';
        return;
      }
      if (!payload.phone && !payload.email) {
        feedback.className = 'form-feedback err';
        feedback.textContent = 'Podaj telefon lub e-mail, żebyśmy mogli oddzwonić.';
        return;
      }
      if (!payload.message || payload.message.length < 5) {
        feedback.className = 'form-feedback err';
        feedback.textContent = 'Opisz krótko sprawę — marka, model, zakres uszkodzeń.';
        return;
      }
      if (!payload.consent) {
        feedback.className = 'form-feedback err';
        feedback.textContent = 'Wymagana zgoda na kontakt.';
        return;
      }

      submitBtn.disabled = true;
      const oldHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>Wysyłam...';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data && data.ok) {
          feedback.className = 'form-feedback ok';
          feedback.textContent = data.message || 'Dziękujemy — oddzwonimy niebawem.';
          form.reset();
        } else {
          feedback.className = 'form-feedback err';
          feedback.textContent = (data && data.error) || 'Nie udało się wysłać. Spróbuj ponownie lub zadzwoń do nas.';
        }
      } catch (err) {
        feedback.className = 'form-feedback err';
        feedback.textContent = 'Problem z połączeniem. Zadzwoń do nas: 32 415 31 43.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = oldHtml;
      }
    });
  }

  // ---------- Rok w stopce (dla pewności, nawet bez SSR) ----------
  // Nie jest używany — rok wstawia Hono, ale zostawiamy helper.
})();
