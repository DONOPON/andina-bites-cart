// view.js — render del catálogo y del carrito
import { formatCOP } from './repo.js';
import * as Cart from './cart.js';
import { lastUpdated } from './storage.js';

export const renderCatalog = (productos, filtro = 'todos') => {
  const wrap = document.getElementById('catalog');
  const list = filtro === 'todos' ? productos : productos.filter(p => p.categoria === filtro);
  wrap.setAttribute('aria-busy', 'false');
  if (!list.length) { wrap.innerHTML = '<p class="loading">No hay productos en esta categoría.</p>'; return; }
  wrap.innerHTML = list.map(p => `
    <article class="card" aria-labelledby="t-${p.id}">
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" width="640" height="480" />
      <div class="card-body">
        <h3 id="t-${p.id}">${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <div class="card-footer">
          <span class="price">${formatCOP(p.precio)}</span>
          <button class="btn-add" data-id="${p.id}" aria-label="Agregar ${p.nombre} al carrito">Agregar</button>
        </div>
      </div>
    </article>
  `).join('');
};

export const renderCart = () => {
  const items = Cart.getItems();
  const { subtotal, iva, total, count } = Cart.totals();
  const list = document.getElementById('cart-items');
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-subtotal').textContent = formatCOP(subtotal);
  document.getElementById('cart-iva').textContent = formatCOP(iva);
  document.getElementById('cart-total').textContent = formatCOP(total);
  const upd = lastUpdated();
  document.getElementById('cart-updated').textContent = upd ? new Date(upd).toLocaleString('es-CO') : '—';

  if (!items.length) { list.innerHTML = '<p class="empty-cart">Tu carrito está vacío 🛒</p>'; return; }
  list.innerHTML = items.map(i => `
    <article class="cart-item" aria-label="${i.nombre}">
      <img src="${i.imagen}" alt="" />
      <div>
        <h4>${i.nombre}</h4>
        <small>${formatCOP(i.precio)}</small>
        <div class="qty" role="group" aria-label="Cantidad de ${i.nombre}">
          <button data-dec="${i.id}" aria-label="Quitar uno">−</button>
          <span>${i.qty}</span>
          <button data-inc="${i.id}" aria-label="Añadir uno">+</button>
        </div>
      </div>
      <button class="btn-remove" data-rm="${i.id}" aria-label="Eliminar ${i.nombre}">🗑</button>
    </article>
  `).join('');
};

export const openCart = () => {
  const panel = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  overlay.hidden = false;
  panel.focus();
};
export const closeCart = () => {
  const panel = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  overlay.hidden = true;
};
