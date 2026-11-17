# Etapa 5 — Correcciones de integración (parcial)

Esta entrega **no es la demo funcional final**. Corrige la resolución de `@wayco/shared` directamente desde el monorepo y el `tsconfig` heredado, añade `zod` y evita un acceso inseguro a `api_url` cuando falta la variable en modo demo.

**No modifica** `apps/frontend`, `apps/backend`, `supabase` ni `packages/shared`.

## Uso

Desde la raíz de Wayco, copiá `demoGitHub` conservando la carpeta `packages/shared`. Después:

```powershell
cd demoGitHub
npm install
Copy-Item .env.demo.example .env.local -Force
npm run dev
```

## Pendiente

Los endpoints de viajes, reservas, vehículos, perfiles y los flujos de autenticación todavía deben simularse con las estructuras exactas esperadas por las pantallas. El bloqueo HTTP actual hace que estas funciones fallen de forma controlada, sin escribir datos reales. No publicar todavía.
