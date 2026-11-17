
import {
  AuthDivider,
} from "./AuthDivider";

import {
  useGoogleAuth,
} from "../hooks/useGoogleAuth";


type GoogleAuthButtonProps = {
  mode:
    "login" |
    "register";

  termsAccepted?:
    boolean;
};


export function GoogleAuthButton({
  mode,
  termsAccepted = false,
}: GoogleAuthButtonProps) {
  const {
    containerRef,
    loading,
  } =
    useGoogleAuth(
      mode,
      termsAccepted,
    );


  const registrationBlocked =
    mode === "register" &&
    !termsAccepted;


  return (
    <>
      <div className="relative flex min-h-[44px] w-full justify-center">
        {loading && (
          <div className="flex h-[44px] w-full items-center justify-center rounded-[8px] border border-[#E2E0D8] bg-white text-[14px] text-[#6B6A66]">
            Cargando Google...
          </div>
        )}

        <div
          ref={
            containerRef
          }
          className={
            loading
              ? "hidden"
              : "flex w-full justify-center"
          }
          style={{
            opacity:
              registrationBlocked
                ? 0.5
                : 1,

            pointerEvents:
              registrationBlocked
                ? "none"
                : "auto",

            filter:
              registrationBlocked
                ? "grayscale(1)"
                : "none",
          }}
          aria-disabled={
            registrationBlocked
          }
        />

        {registrationBlocked &&
          !loading && (
            <div
              className="absolute inset-0 cursor-not-allowed"
              aria-hidden="true"
            />
          )}
      </div>


      {mode === "register" && (
        <p className="mt-2 text-center text-[12px] text-muted-foreground">
          Para registrarse con Google, es necesario aceptar los términos y condiciones.
        </p>
      )}


      <AuthDivider
        mode={
          mode
        }
      />
    </>
  );
}
