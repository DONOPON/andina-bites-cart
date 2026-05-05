// cart.js — lógica del carrito
import { loadCart, saveCart } from './storage.js';

let items = loadCart();
const subscribers = new Set();

const notify = () => { saveCart(items); subscribers.forEach(fn => fn(items)); };

export const onChange = (fn) => { subscribers.add(fn); fn(items); };

export const getItems = () => items;

export const addItem = (producto) => {
  const found = items.find(i => i.id === producto.id);
  if (found) found.qty += 1;
  else items.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen, qty: 1 });
  notify();
};

export const updateQty = (id, delta) => {
  const it = items.find(i => i.id === id);
  if (!it) return;
  it.qty += delta;
  if (it.qty <= 0) items = items.filter(i => i.id !== id);
  notify();
};

export const removeItem = (id) => { items = items.filter(i => i.id !== id); notify(); };

export const clear = () => { items = []; notify(); };

export const totals = () => {
  const subtotal = items.reduce((s, i) => s + i.precio * i.qty, 0);
  const iva = Math.round(subtotal * 0.15 * 100) / 100;
  const total = Math.round((subtotal + iva) * 100) / 100;
  return { subtotal, iva, total, count: items.reduce((s, i) => s + i.qty, 0) };
};
