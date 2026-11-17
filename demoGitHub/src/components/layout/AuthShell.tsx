import type { ReactNode } from "react";

import { useRequireAuth } from "@/features/auth/hooks/useRequireAuth";
import { BottomNav } from "./BottomNav";

type AuthShellProps = {
  children: ReactNode;
  hideNav?: boolean;
};

export function AuthShell({
  children,
  hideNav = false,
}: AuthShellProps) {
  const {
    ready,
    authenticated,
  } = useRequireAuth();

  if (!ready) {
    return <AuthShellLoader />;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="wayco-shell min-h-screen pb-28">
      {children}

      {!hideNav && <BottomNav />}
    </div>
  );
}

function AuthShellLoader() {
  return (
    <div className="wayco-shell flex min-h-screen items-center justify-center">
      <span
        aria-label="Verificando sesión"
        className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground"
      />
    </div>
  );
}
