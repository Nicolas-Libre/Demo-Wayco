import { Link } from "@tanstack/react-router";

type BackLinkProps = {
  to: string;
  label?: string;
};

export function BackLink({
  to,
  label = "Volver",
}: BackLinkProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-muted"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </Link>
  );
}
