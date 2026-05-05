# Burger Andina

Sitio web estático de Burger Andina — restaurante de comida rápida urbana en Ecuador.

## Tecnologías
- HTML5 semántico
- CSS3 (responsive, accesible)
- JavaScript ES6 (módulos nativos)
- IndexedDB / localStorage para persistencia
- JSON local como fuente del catálogo

## Estructura
```
/
├── index.html
├── assets/
│   ├── styles.css
│   └── img/
├── data/
│   └── productos.json
└── js/
    ├── app.js
    ├── cart.js
    ├── repo.js
    ├── storage.js
    ├── validators.js
    └── view.js
```

## Uso local
Como usa `fetch()` para cargar `data/productos.json`, debe servirse por HTTP (no abrir el archivo `index.html` directamente con `file://`).

```bash
python3 -m http.server 8000
# o
npx serve .
```
Luego abre `http://localhost:8000`.

## Despliegue en GitHub Pages
1. Sube el contenido de esta carpeta a la raíz de un repositorio (o configura Pages para servir desde `/public/burger`).
2. En **Settings → Pages**, selecciona la rama y la carpeta donde está `index.html`.
3. El archivo `.nojekyll` ya está incluido para evitar que Jekyll filtre archivos.
4. Todas las rutas son **relativas**, así que funciona en cualquier subdirectorio (ej. `usuario.github.io/mi-repo/`).

## Accesibilidad
- Skip link, roles ARIA, `aria-live` en carrito y catálogo.
- Contraste AA, navegación por teclado, focus visible.

## Persistencia
- Carrito: `localStorage`
- Pedidos finalizados: `IndexedDB`
- Visitas y sesión: `localStorage` / `sessionStorage`
