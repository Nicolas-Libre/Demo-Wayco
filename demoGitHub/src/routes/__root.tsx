import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { activeDemoUserId, DEMO_USER_ID, MARTINA_USER_ID, switchDemoUser } from "../demo/storage/demo_storage";
import { Toaster } from "sonner";

import { reportApplicationError } from "../lib/error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>

        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Página no encontrada
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscás no existe o fue movida.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);

    reportApplicationError(error, {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">
          Ocurrió un error
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Algo salió mal. Intentá nuevamente.
        </p>

        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Reintentar
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm"
          >
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route =
  createRootRouteWithContext<{
    queryClient: QueryClient;
  }>()({
    component: RootComponent,
    errorComponent: ErrorComponent,
    notFoundComponent: NotFoundComponent,
  });

function DemoAccountSwitcher({ onSwitch }: { onSwitch: () => void }) {
  const [active, setActive] = useState(() => activeDemoUserId());
  useEffect(() => {
    const update = () => setActive(activeDemoUserId());
    window.addEventListener("wayco-demo-changed", update);
    return () => window.removeEventListener("wayco-demo-changed", update);
  }, []);
  return <div style={{ position: "fixed", right: 12, bottom: 80, zIndex: 9999, display: "flex", alignItems: "center", gap: 6, background: "#fff", color: "#222", padding: "8px 10px", borderRadius: 14, border: "1px solid #d7d7d7", boxShadow: "0 4px 18px #0002", fontSize: 12 }}>
    <span>Demo:</span>
    <select aria-label="Cambiar usuario de demostración" value={active} onChange={e => { switchDemoUser(e.target.value); setActive(e.target.value); onSwitch(); }} style={{ background: "#fff", color: "#222", border: "1px solid #ddd", borderRadius: 6, padding: 5 }}>
      <option value={DEMO_USER_ID}>Usuario Demo</option>
      <option value={MARTINA_USER_ID}>Martina López</option>
    </select>
  </div>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <DemoAccountSwitcher onSwitch={() => { queryClient.clear(); window.location.reload(); }} />

      <Toaster
        position="top-center"
        richColors
        closeButton={false}
        duration={3000}
      />
    </QueryClientProvider>
  );
}