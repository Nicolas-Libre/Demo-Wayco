type AuthMode = "login" | "register";

type AuthDividerProps = {
  mode: AuthMode;
};

export function AuthDivider({
  mode,
}: AuthDividerProps) {
  const label =
    mode === "login"
      ? "o iniciá sesión con tu email"
      : "o registrate con tu email";

  return (
    <div className="my-5 flex items-center gap-3">
      <span
        className="h-px flex-1"
        style={{ background: "#E2E0D8" }}
      />

      <span
        className="text-[12px]"
        style={{ color: "#9B9A96" }}
      >
        {label}
      </span>

      <span
        className="h-px flex-1"
        style={{ background: "#E2E0D8" }}
      />
    </div>
  );
}
