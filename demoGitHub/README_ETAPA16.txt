ETAPA 16 — GitHub Pages

Este ZIP es un parche para la raíz del repositorio Wayco. Copiar demoGitHub/ y .github/ en la raíz.

Requisitos: demoGitHub/package-lock.json y packages/shared/ deben estar versionados en el repositorio.

1. Verificar localmente desde demoGitHub: npm run build
2. En GitHub: Settings > Pages > Build and deployment > Source: GitHub Actions.
3. Subir cambios a la rama main del repositorio donde está demoGitHub.
4. Ir a Actions > Publicar demo Wayco en GitHub Pages y comprobar que build y deploy terminen correctamente.
5. Abrir la URL publicada y probar publicar, buscar, reservar, aceptar/rechazar, recargar en una ruta interna.

AVISO: La demo usa localStorage, así que los datos no se comparten entre dispositivos o navegadores. Dos usuarios simulados comparten datos solo en el mismo navegador.
El workflow establece VITE_DEMO_MODE=true durante el build. No usar credenciales ni variables de entorno de producción.
