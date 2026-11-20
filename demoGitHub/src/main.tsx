import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { getRouter } from "./router";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'No se encontró el elemento HTML con id="root". Revisá apps/frontend/index.html.',
  );
}

const router = getRouter();

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
// Registrar el Service Worker únicamente en la versión publicada.
// En desarrollo, Vite mantiene su propio servidor y no necesita caché PWA.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swUrl, { scope: import.meta.env.BASE_URL })
      .catch((error) => console.warn("Wayco: no se pudo registrar el Service Worker", error));
  });
}
