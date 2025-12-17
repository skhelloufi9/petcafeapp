
// Mobile menu toggle
const menuBtn = document.getElementById('menuToggle');
const nav = document.getElementById('siteNav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('show');
  });

  // Close menu on link click (mobile)
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
    })
  );
}

// Smooth scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${id}`);
    }
  });
});

// Back to top button
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.style.display = window.scrollY > 600 ? 'grid' : 'none';
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Booking form validation (simple, client-side)
const form = document.getElementById('bookingForm');
const formMsg = document.getElementById('formMsg');

// Order toggle (on book page) — show/hide order section if present
const orderToggle = document.getElementById('orderToggle');
const orderSection = document.getElementById('orderSection');
if (orderToggle && orderSection) {
  orderToggle.addEventListener('change', () => {
    orderSection.style.display = orderToggle.checked ? 'block' : 'none';
  });
}

function validateDateInFuture(dateStr) {
  if (!dateStr) return false;
  const today = new Date(); today.setHours(0,0,0,0);
  const date = new Date(dateStr);
  return date >= today;
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const date = (fd.get('date') || '').toString();
    const time = (fd.get('time') || '').toString();
    const guests = Number(fd.get('guests') || 0);

    // Tiny checks
    let error = '';
    if (!name) error = 'Please enter your name.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) error = 'Please enter a valid email.';
    else if (!validateDateInFuture(date)) error = 'Please pick today or a future date.';
    else if (!time) error = 'Please choose a time.';
    else if (guests < 1 || guests > 6) error = 'Guests must be between 1 and 6.';

    if (error) {
      formMsg.textContent = error;
      formMsg.style.color = '#b00020';
      return;
    }

    // Collect ordered menu items (if any)
    const orders = [];
    if (form.querySelectorAll) {
      form.querySelectorAll('input[name="order_items"]:checked').forEach(cb => {
        const key = cb.dataset.key || '';
        const [itemName, priceStr] = (cb.value || '').split('|');
        const qtyInput = form.querySelector(`input[name="qty_${key}"]`);
        const qty = qtyInput ? Number(qtyInput.value) || 1 : 1;
        orders.push({ name: itemName || cb.value, price: Number(priceStr) || 0, qty });
      });
    }

    // Success (mock) — include orders if present
    formMsg.style.color = '#1b5e20';
    let successMsg = 'Thanks! Your request has been received. We’ll email you shortly.';
    if (orders.length) {
      const items = orders.map(o => `${o.qty}× ${o.name}`).join(', ');
      successMsg += ` Ordered: ${items}.`;
    }
    formMsg.textContent = successMsg;
    form.reset();
    // hide order section after reset
    if (orderSection) orderSection.style.display = 'none';
  });
}
