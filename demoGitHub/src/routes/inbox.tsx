import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/layout/AuthShell";
import { ArrowLeft, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [{ title: "Mensajes — Wayco" }] }),
  component: () => (
    <AuthShell>
      <InboxPage />
    </AuthShell>
  ),
});

function InboxPage() {
  return (
    <div>
      <header className="flex items-center gap-2 bg-white px-3 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
        <Link to="/perfil" aria-label="Volver" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--surface-2)]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[17px] font-bold">Mensajes</h1>
      </header>

      <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-2)]">
          <MessageSquare className="h-7 w-7 text-[var(--text-secondary)]" strokeWidth={1.5} />
        </div>
        <p className="mt-5 text-[16px] font-semibold text-[var(--text-primary)]">
          Todavía no tenés mensajes
        </p>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          Cuando reserves o publiques un viaje vas a poder chatear con la otra persona acá.
        </p>
      </div>
    </div>
  );
}


