import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  supabase,
} from "@/lib/supabase";

import {
  WaycoLogo,
} from "@/components/branding/WaycoBrand";

import { useQueryClient } from "@tanstack/react-query";


export const Route =
  createFileRoute(
    "/reset-password",
  )({
    head: () => ({
      meta: [
        {
          title:
            "Cambiar contraseña — Wayco",
        },

        {
          name:
            "description",

          content:
            "Creá una nueva contraseña para tu cuenta de Wayco.",
        },
      ],
    }),

    component:
      ResetPasswordPage,
  });


function ResetPasswordPage() {
  const navigate =
    useNavigate();
  
  const queryClient =
    useQueryClient();

  const [
    password,
    setPassword,
  ] =
    useState(
      "",
    );

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState(
      "",
    );

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(
      false,
    );

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(
      false,
    );

  const [
    checkingSession,
    setCheckingSession,
  ] =
    useState(
      true,
    );

  const [
    recoverySessionValid,
    setRecoverySessionValid,
  ] =
    useState(
      false,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      false,
    );

  const [
    completed,
    setCompleted,
  ] =
    useState(
      false,
    );


  /* =======================================================
   * RECOVERY SESSION
   * ===================================================== */

  useEffect(() => {
    let mounted =
      true;


    async function verifySession() {
      const {
        data: {
          session,
        },
      } =
        await supabase.auth
          .getSession();


      if (
        !mounted
      ) {
        return;
      }


      if (
        session
      ) {
        setRecoverySessionValid(
          true,
        );
      }


      setCheckingSession(
        false,
      );
    }


    void verifySession();


    const {
      data: {
        subscription,
      },
    } =
      supabase.auth
        .onAuthStateChange(
          (
            event,
            session,
          ) => {
            if (
              !mounted
            ) {
              return;
            }


            if (
              event ===
                "PASSWORD_RECOVERY" &&
              session
            ) {
              setRecoverySessionValid(
                true,
              );

              setCheckingSession(
                false,
              );
            }
          },
        );


    return () => {
      mounted =
        false;

      subscription
        .unsubscribe();
    };
  }, []);


  /* =======================================================
   * UPDATE PASSWORD
   * ===================================================== */

  async function handleUpdatePassword() {
    if (
      password.length <
      8
    ) {
      toast.error(
        "La contraseña debe tener al menos 8 caracteres.",
      );

      return;
    }


    if (
      password !==
      confirmPassword
    ) {
      toast.error(
        "Las contraseñas no coinciden.",
      );

      return;
    }


    setLoading(
      true,
    );


    try {
      const {
        error,
      } =
        await supabase.auth
          .updateUser({
            password,
          });


      if (
        error
      ) {
        throw error;
      }


      /*
       * La contraseña ya fue modificada.
       *
       * Cerramos la sesión temporal de recuperación
       * para obligar al usuario a iniciar sesión
       * nuevamente con su contraseña nueva.
       */
      const { error: signOutError } =
  await supabase.auth.signOut();

if (signOutError) {
  throw signOutError;
}

queryClient.clear();

setCompleted(
  true,
);
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo cambiar la contraseña.",
      );
    } finally {
      setLoading(
        false,
      );
    }
  }


  /* =======================================================
   * LOADING
   * ===================================================== */

  if (
    checkingSession
  ) {
    return (
      <main className="wayco-shell flex min-h-screen items-center justify-center px-6">
        <p className="text-[14px] text-muted-foreground">
          Verificando enlace...
        </p>
      </main>
    );
  }


  /* =======================================================
   * SUCCESS
   * ===================================================== */

  if (
    completed
  ) {
    return (
      <main className="wayco-shell min-h-screen px-6 pb-10 pt-10">
        <div className="mx-auto max-w-[390px]">
          <div className="flex justify-center">
            <WaycoLogo
              size={
                48
              }
            />
          </div>


          <div className="mt-12 flex flex-col items-center text-center">
            <span
              className="inline-flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                background:
                  "#E8F5F0",
              }}
            >
              <Check
                className="h-8 w-8"
                style={{
                  color:
                    "#1D9E75",
                }}
              />
            </span>


            <h1 className="mt-6 text-[24px] font-bold text-[#111110]">
              Contraseña actualizada
            </h1>


            <p className="mt-2 max-w-[320px] text-[14px] leading-[1.55] text-muted-foreground">
              Tu contraseña fue cambiada correctamente. Iniciá sesión
              nuevamente con tu nueva contraseña.
            </p>


            <button
              type="button"
              className="wayco-btn wayco-btn-primary mt-8"
              onClick={() =>
                navigate({
                  to:
                    "/auth/login",
                })
              }
            >
              Ir a iniciar sesión
            </button>
          </div>
        </div>
      </main>
    );
  }


  /* =======================================================
   * INVALID LINK
   * ===================================================== */

  if (
    !recoverySessionValid
  ) {
    return (
      <main className="wayco-shell min-h-screen px-6 pb-10 pt-10">
        <div className="mx-auto max-w-[390px]">
          <div className="flex justify-center">
            <WaycoLogo
              size={
                48
              }
            />
          </div>


          <div className="mt-12 text-center">
            <h1 className="text-[24px] font-bold text-[#111110]">
              Enlace inválido o vencido
            </h1>


            <p className="mt-2 text-[14px] leading-[1.55] text-muted-foreground">
              El enlace para cambiar tu contraseña ya no es válido.
              Solicitá uno nuevo desde la pantalla de inicio de sesión.
            </p>


            <button
              type="button"
              className="wayco-btn wayco-btn-primary mt-8"
              onClick={() =>
                navigate({
                  to:
                    "/auth/login",
                })
              }
            >
              Volver a iniciar sesión
            </button>
          </div>
        </div>
      </main>
    );
  }


  /* =======================================================
   * FORM
   * ===================================================== */

  return (
    <main className="wayco-shell min-h-screen px-6 pb-10 pt-8">
      <div className="mx-auto max-w-[390px]">
        <div className="flex justify-center">
          <WaycoLogo
            size={
              44
            }
          />
        </div>


        <div className="mt-10">
          <span
            className="inline-flex h-11 w-11 items-center justify-center rounded-[12px]"
            style={{
              background:
                "#E8F5F0",
            }}
          >
            <KeyRound
              className="h-5 w-5"
              style={{
                color:
                  "#1D9E75",
              }}
            />
          </span>


          <h1 className="mt-5 text-[26px] font-bold tracking-tight text-[#111110]">
            Creá una nueva contraseña
          </h1>


          <p className="mt-2 text-[14px] leading-[1.55] text-muted-foreground">
            Elegí una contraseña nueva para volver a ingresar a tu
            cuenta de Wayco.
          </p>
        </div>


        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-[14px] font-medium">
              Nueva contraseña
            </span>

            <div className="relative">
              <input
                className="wayco-input pr-12"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={
                  password
                }
                onChange={(
                  event,
                ) =>
                  setPassword(
                    event.target.value,
                  )
                }
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                disabled={
                  loading
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (
                      value,
                    ) =>
                      !value,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showPassword
                  ? (
                    <EyeOff className="h-5 w-5" />
                  )
                  : (
                    <Eye className="h-5 w-5" />
                  )}
              </button>
            </div>
          </label>


          <label className="block">
            <span className="mb-1.5 block text-[14px] font-medium">
              Repetir contraseña
            </span>

            <div className="relative">
              <input
                className="wayco-input pr-12"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={
                  confirmPassword
                }
                onChange={(
                  event,
                ) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                autoComplete="new-password"
                placeholder="Repetí la nueva contraseña"
                disabled={
                  loading
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (
                      value,
                    ) =>
                      !value,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                aria-label={
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showConfirmPassword
                  ? (
                    <EyeOff className="h-5 w-5" />
                  )
                  : (
                    <Eye className="h-5 w-5" />
                  )}
              </button>
            </div>
          </label>


          <button
            type="button"
            className="wayco-btn wayco-btn-primary"
            disabled={
              password.length <
                8 ||
              confirmPassword.length <
                8 ||
              loading
            }
            onClick={() => {
              void handleUpdatePassword();
            }}
          >
            {loading
              ? "Actualizando..."
              : "Cambiar contraseña"}
          </button>
        </div>
      </div>
    </main>
  );
}