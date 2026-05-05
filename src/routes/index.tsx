import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Renderiza el sitio estático de Burger Andina (HTML/CSS/JS puro)
  // ubicado en /public/burger/, totalmente editable desde el explorador de archivos.
  return (
    <iframe
      src="/burger/index.html"
      title="Burger Andina"
      style={{ width: "100vw", height: "100vh", border: 0, display: "block" }}
    />
  );
}
