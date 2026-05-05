// repo.js — carga datos del catálogo desde JSON local
export async function fetchProductos() {
  const res = await fetch('data/productos.json');
  if (!res.ok) throw new Error('No se pudo cargar el catálogo');
  const data = await res.json();
  return data.productos;
}

export const formatCOP = (n) =>
  new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
