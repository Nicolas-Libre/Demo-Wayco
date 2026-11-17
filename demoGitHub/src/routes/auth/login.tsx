import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  supabase,
} from "@/lib/supabase";

import {
  api_post,
  ApiError,
} from "@/lib/api";

import {
  WaycoLogo,
} from "@/components/branding/WaycoBrand";

import {
  BackLink,
} from "@/components/navigation/BackLink";

import {
  WaycoFullScreenLoader,
} from "@/components/loading/Loader";

import {
  GoogleAuthButton,
} from "@/features/auth/components/GoogleAuthButton";


export const Route =
  createFileRoute(
    "/auth/login",
  )({
    head: () => ({
      meta: [
        {
          title:
            "Iniciar sesión — Wayco",
        },

        {
          name:
            "description",

          content:
            "Entrá a tu cuenta de Wayco para buscar o publicar viajes.",
        },
      ],
    }),

    component:
      LoginPage,
  });


function LoginPage() {
  const navigate =
    useNavigate();

  const [
    email,
    setEmail,
  ] =
    useState(
      "",
    );

  const [
    password,
    setPassword,
  ] =
    useState(
      "",
    );

  const [
    showPwd,
    setShowPwd,
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
    forgotOpen,
    setForgotOpen,
  ] =
    useState(
      false,
    );


  /* =======================================================
   * LOGIN
   * ===================================================== */

  async function handleLogin() {
    setLoading(
      true,
    );


    const {
      error,
    } =
      await supabase.auth
        .signInWithPassword({
          email,
          password,
        });


    setLoading(
      false,
    );


    if (
      error
    ) {
      const normalizedMessage =
        error.message
          .toLowerCase();


      if (
        normalizedMessage.includes(
          "email not confirmed",
        )
      ) {
        toast.error(
          "Primero tenés que confirmar tu email. Revisá tu bandeja de entrada.",
        );

        return;
      }


      toast.error(
        "Email o contraseña incorrectos",
      );

      return;
    }


    toast.success(
      "¡Bienvenido de vuelta!",
    );


    await navigate({
      to:
        "/auth/home",
    });
  }


  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <div className="wayco-shell min-h-screen px-6 pb-10 pt-6">
      <header className="flex items-center justify-between">
        <BackLink
          to="/welcome"
        />

        <div className="flex items-center gap-2">
          <WaycoLogo
            size={
              28
            }
          />
        </div>

        <span className="w-10" />
      </header>


      <div className="mt-8 animate-wayco-fade">
        <h1 className="text-[28px] font-bold tracking-tight">
          Iniciá sesión
        </h1>

        <p className="mt-1 text-[14px] text-muted-foreground">
          Compartí el camino con Wayco.
        </p>


        <div className="mt-8">
          <GoogleAuthButton
            mode="login"
          />
        </div>


        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[14px] font-medium">
              Email
            </span>

            <input
              className="wayco-input"
              type="email"
              autoCapitalize="none"
              value={
                email
              }
              onChange={(
                event,
              ) =>
                setEmail(
                  event.target.value,
                )
              }
              placeholder="tu@email.com"
            />
          </label>


          <label className="block">
            <span className="mb-1.5 block text-[14px] font-medium">
              Contraseña
            </span>

            <div className="relative">
              <input
                className="wayco-input pr-12"
                type={
                  showPwd
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
                placeholder="Tu contraseña"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPwd(
                    (
                      value,
                    ) =>
                      !value,
                  )
                }
                aria-label={
                  showPwd
                    ? "Ocultar"
                    : "Mostrar"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
              >
                {showPwd
                  ? (
                    <EyeOff className="h-5 w-5" />
                  )
                  : (
                    <Eye className="h-5 w-5" />
                  )}
              </button>
            </div>
          </label>


          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                setForgotOpen(
                  true,
                )
              }
              className="text-[14px] font-medium"
              style={{
                color:
                  "var(--green-primary)",
              }}
            >
              Olvidé mi contraseña
            </button>
          </div>


          <button
            type="button"
            className="wayco-btn wayco-btn-primary"
            disabled={
              !email ||
              !password ||
              loading
            }
            onClick={() => {
              void handleLogin();
            }}
          >
            Iniciar sesión
          </button>


          {loading && (
            <WaycoFullScreenLoader />
          )}


          <p className="pt-2 text-center text-[14px] text-muted-foreground">
            ¿No tenés cuenta?{" "}

            <Link
              to="/register"
              className="font-semibold"
              style={{
                color:
                  "var(--green-primary)",
              }}
            >
              Registrate
            </Link>
          </p>
        </div>
      </div>


      {forgotOpen && (
        <ForgotSheet
          onClose={() =>
            setForgotOpen(
              false,
            )
          }
        />
      )}
    </div>
  );
}


/* =========================================================
 * FORGOT PASSWORD
 * ======================================================= */

function ForgotSheet({
  onClose,
}: {
  onClose:
    () => void;
}) {
  const [
    email,
    setEmail,
  ] =
    useState(
      "",
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      false,
    );


  async function handleSend() {
    const normalizedEmail =
      email
        .trim()
        .toLowerCase();


    if (
      !normalizedEmail
    ) {
      return;
    }


    setLoading(
      true,
    );


    try {
      /*
       * Antes de pedirle a Supabase que envíe
       * el correo verificamos que exista una
       * cuenta Wayco con ese email.
       */
      await api_post<
  {
    exists:
      true;
  },
  {
    email:
      string;
  }
>(
  "/api/auth/password-recovery/check",
  {
    email:
      normalizedEmail,
  },
  {
    authenticated:
      false,
  },
);


      const {
        error,
      } =
        await supabase.auth
          .resetPasswordForEmail(
            normalizedEmail,
            {
              redirectTo:
                `${window.location.origin}/reset-password`,
            },
          );


      if (
        error
      ) {
        throw error;
      }


      toast.success(
        "Te enviamos un correo para cambiar tu contraseña.",
      );


      onClose();
    } catch (
      error
    ) {
      if (
        error instanceof
          ApiError &&
        (
          error.status_code ===
            404 ||
          error.error_code ===
            "EMAIL_NOT_REGISTERED"
        )
      ) {
        toast.error(
          "No existe una cuenta de Wayco asociada a ese email.",
        );

        return;
      }


      if (
        error instanceof
          ApiError &&
        error.status_code ===
          400
      ) {
        toast.error(
          error.message,
        );

        return;
      }


      toast.error(
        error instanceof Error
          ? error.message
          : "No pudimos enviar el correo de recuperación.",
      );
    } finally {
      setLoading(
        false,
      );
    }
  }


  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={
        loading
          ? undefined
          : onClose
      }
    >
      <div
        className="mx-auto w-full max-w-[390px] rounded-t-[20px] bg-card p-6 pb-8 animate-wayco-fade"
        onClick={(
          event,
        ) =>
          event.stopPropagation()
        }
      >
        <div
          className="mx-auto mb-4 h-1.5 w-10 rounded-full"
          style={{
            backgroundColor:
              "var(--border)",
          }}
        />


        <h2 className="text-[18px] font-semibold">
          Recuperar contraseña
        </h2>


        <p className="mt-1 text-[14px] leading-[1.5] text-muted-foreground">
          Ingresá el email asociado a tu cuenta. Te enviaremos un
          enlace para crear una nueva contraseña.
        </p>


        <label className="mt-5 block">
          <span className="mb-1.5 block text-[14px] font-medium">
            Email
          </span>

          <input
            className="wayco-input"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            value={
              email
            }
            onChange={(
              event,
            ) =>
              setEmail(
                event.target.value,
              )
            }
            placeholder="tu@email.com"
            disabled={
              loading
            }
          />
        </label>


        <button
          type="button"
          className="wayco-btn wayco-btn-primary mt-5"
          disabled={
            !email.trim() ||
            loading
          }
          onClick={() => {
            void handleSend();
          }}
        >
          {loading
            ? "Enviando..."
            : "Enviar enlace"}
        </button>


        <button
          type="button"
          className="wayco-btn wayco-btn-secondary mt-2"
          onClick={
            onClose
          }
          disabled={
            loading
          }
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}