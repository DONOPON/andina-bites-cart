// app.js — orquestador
import { fetchProductos } from './repo.js';
import * as Cart from './cart.js';
import * as View from './view.js';
import { validateForm, wireLiveValidation } from './validators.js';
import { startSession, incVisits, guardarPedido } from './storage.js';

let productos = [];
let filtroActual = 'todos';

const init = async () => {
  // Footer dinámico
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('visits').textContent = incVisits();
  const start = startSession();
  setInterval(() => {
    document.getElementById('session-time').textContent = Math.floor((Date.now() - start) / 1000);
  }, 1000);

  // Catálogo
  try {
    productos = await fetchProductos();
    View.renderCatalog(productos, filtroActual);
  } catch (e) {
    document.getElementById('catalog').innerHTML = `<p class="loading">⚠️ ${e.message}</p>`;
  }

  // Filtros
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');
      filtroActual = chip.dataset.filter;
      View.renderCatalog(productos, filtroActual);
    });
  });

  // Click delegado en catálogo y carrito
  document.getElementById('catalog').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add');
    if (!btn) return;
    const p = productos.find(x => x.id === btn.dataset.id);
    if (p) { Cart.addItem(p); View.openCart(); }
  });

  document.getElementById('cart-items').addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.inc) Cart.updateQty(t.dataset.inc, +1);
    if (t.dataset.dec) Cart.updateQty(t.dataset.dec, -1);
    if (t.dataset.rm) Cart.removeItem(t.dataset.rm);
  });

  // Carrito UI
  Cart.onChange(() => View.renderCart());
  document.getElementById('btn-cart').addEventListener('click', View.openCart);
  document.getElementById('btn-close-cart').addEventListener('click', View.closeCart);
  document.getElementById('cart-overlay').addEventListener('click', View.closeCart);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') View.closeCart(); });

  document.getElementById('btn-clear').addEventListener('click', () => {
    if (confirm('¿Vaciar el carrito?')) Cart.clear();
  });

  document.getElementById('btn-checkout').addEventListener('click', async () => {
    const items = Cart.getItems();
    if (!items.length) { alert('Agrega productos antes de finalizar.'); return; }
    const t = Cart.totals();
    await guardarPedido({ items, totales: t });
    alert(`✅ ¡Pedido registrado!\nTotal: $${t.total.toLocaleString('es-CO')}\nGuardado en IndexedDB.`);
    Cart.clear();
    View.closeCart();
  });

  // Formulario
  const form = document.getElementById('contact-form');
  wireLiveValidation(form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    if (validateForm(form)) {
      status.textContent = '✅ ¡Mensaje enviado! Te contactaremos pronto.';
      form.reset();
    } else {
      status.textContent = '';
    }
  });
};

document.addEventListener('DOMContentLoaded', init);
