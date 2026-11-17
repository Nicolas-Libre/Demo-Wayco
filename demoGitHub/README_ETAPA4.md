# Etapa 4 — Integración visual inicial (NO demo funcional completa)

Esta entrega contiene las pantallas originales y la configuración Vite para ejecutarlas como aplicación separada. El guard de autenticación se sustituye por uno ficticio y el cliente HTTP bloquea todas las solicitudes cuando VITE_DEMO_MODE=true. **No hay todavía adaptadores para todas las consultas, creación de viajes y reservas**: las pantallas que los requieran pueden mostrar errores. No publicar todavía.

Desde la raíz del repositorio:

```bash
npm install
npm run build:shared
cd demoGitHub
cp .env.demo.example .env.local
npm run dev
```

En PowerShell: `Copy-Item .env.demo.example .env.local`.

Pendiente: mock completo de Supabase, hooks y servicios de viajes, reservas, vehículos, perfiles y mapas; pruebas de ausencia de tráfico externo; rutas de Pages.
