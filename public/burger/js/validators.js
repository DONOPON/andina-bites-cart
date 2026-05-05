// validators.js — validación del formulario con regex y mensajes accesibles
const RX = {
  nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,40}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  telefono: /^0[2-9][0-9]{8}$/,
  mensaje: /^[\s\S]{10,400}$/,
};
const MSG = {
  nombre: 'Solo letras, entre 3 y 40 caracteres.',
  email: 'Ingresa un correo electrónico válido.',
  telefono: 'Número ecuatoriano de 10 dígitos (ej: 0991234567).',
  mensaje: 'El mensaje debe tener entre 10 y 400 caracteres.',
};

const setError = (id, msg) => {
  const input = document.getElementById(id);
  const err = document.getElementById('err-' + id);
  if (msg) {
    input.setAttribute('aria-invalid', 'true');
    err.textContent = msg;
  } else {
    input.removeAttribute('aria-invalid');
    err.textContent = '';
  }
};

export const validateForm = (form) => {
  let ok = true;
  for (const name of Object.keys(RX)) {
    const value = form[name].value.trim();
    if (!RX[name].test(value)) { setError(name, MSG[name]); ok = false; }
    else setError(name, '');
  }
  return ok;
};

export const wireLiveValidation = (form) => {
  for (const name of Object.keys(RX)) {
    const el = form[name];
    el.addEventListener('blur', () => {
      const value = el.value.trim();
      setError(name, RX[name].test(value) ? '' : MSG[name]);
    });
  }
};
