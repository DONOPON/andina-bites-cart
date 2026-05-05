// storage.js — persistencia: localStorage + sessionStorage + cookies + IndexedDB

const KEY = 'ba_cart';

// --- localStorage (carrito principal) ---
export const loadCart = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
};
export const saveCart = (items) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  localStorage.setItem(KEY + '_updated', new Date().toISOString());
};
export const lastUpdated = () => localStorage.getItem(KEY + '_updated');

// --- sessionStorage (tiempo de sesión) ---
export const startSession = () => {
  if (!sessionStorage.getItem('ba_session_start')) {
    sessionStorage.setItem('ba_session_start', Date.now().toString());
  }
  return parseInt(sessionStorage.getItem('ba_session_start'), 10);
};

// --- cookies (visitas) ---
export const setCookie = (name, value, days = 30) => {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
};
export const getCookie = (name) => {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
};
export const incVisits = () => {
  const v = (parseInt(getCookie('ba_visits') || '0', 10) || 0) + 1;
  setCookie('ba_visits', String(v));
  return v;
};

// --- IndexedDB (historial de pedidos) ---
const DB_NAME = 'burger_andina';
const STORE = 'pedidos';

const openDB = () => new Promise((resolve, reject) => {
  const req = indexedDB.open(DB_NAME, 1);
  req.onupgradeneeded = () => {
    const db = req.result;
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    }
  };
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

export const guardarPedido = async (pedido) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).add({ ...pedido, fecha: new Date().toISOString() });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

export const listarPedidos = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};
