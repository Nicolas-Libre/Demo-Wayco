
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  useState,
} from "react";

import {
  Car,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  personNameSchema,
} from "@wayco/shared/users";

import {
  supabase,
} from "@/lib/supabase";

import {
  BackLink,
} from "@/components/navigation/BackLink";

import {
  WaycoFullScreenLoader,
} from "@/components/loading/Loader";

import {
  DelayedConfirmationButton,
} from "@/components/feedback/DelayedConfirmationButton";

import {
  GoogleAuthButton,
} from "@/features/auth/components/GoogleAuthButton";

import {
  TermsAndConditions,
} from "@/features/auth/components/TermsAndConditions";


export const Route =
  createFileRoute(
    "/register",
  )({
    head: () => ({
      meta: [
        {
          title:
            "Crear cuenta — Wayco",
        },

        {
          name:
            "description",

          content:
            "Creá tu cuenta en Wayco para reservar o publicar viajes.",
        },
      ],
    }),

    component:
      RegisterPage,
  });


function RegisterPage() {
  const navigate =
    useNavigate();

  const [
    name,
    setName,
  ] =
    useState(
      "",
    );

  const [
    surname,
    setSurname,
  ] =
    useState(
      "",
    );

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
    telefono,
    setTelefono,
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
    done,
    setDone,
  ] =
    useState(
      false,
    );

  const [
    termsAccepted,
    setTermsAccepted,
  ] =
    useState(
      false,
    );

  const [
    errors,
    setErrors,
  ] =
    useState<
      Record<
        string,
        string
      >
    >(
      {},
    );


  function validateForm():
    boolean {
    const nextErrors:
      Record<
        string,
        string
      > = {};


    const nameResult =
      personNameSchema
        .safeParse(
          name,
        );


    if (
      !nameResult.success
    ) {
      nextErrors.name =
        nameResult.error
          .issues[0]
          ?.message ??
        "Nombre inválido.";
    }


    const surnameResult =
      personNameSchema
        .safeParse(
          surname,
        );


    if (
      !surnameResult.success
    ) {
      nextErrors.surname =
        surnameResult.error
          .issues[0]
          ?.message ??
        "Apellido inválido.";
    }


    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim(),
      )
    ) {
      nextErrors.email =
        "Email inválido";
    }


    if (
      password.length <
      8
    ) {
      nextErrors.password =
        "Mínimo 8 caracteres";
    }


    if (
      !telefono.trim() ||
      telefono
        .replace(
          /\D/g,
          "",
        )
        .length <
        8
    ) {
      nextErrors.telefono =
        "Teléfono inválido";
    }


    setErrors(
      nextErrors,
    );


    return (
      Object.keys(
        nextErrors,
      ).length ===
      0
    );
  }


  async function handleSignUp() {
    if (
      !termsAccepted
    ) {
      toast.error(
        "Debés aceptar los términos y condiciones para crear una cuenta.",
      );

      return;
    }


    if (
      !validateForm()
    ) {
      return;
    }


    const normalizedName =
      personNameSchema
        .parse(
          name,
        );

    const normalizedSurname =
      personNameSchema
        .parse(
          surname,
        );

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    const normalizedPhone =
      telefono
        .trim();


    setLoading(
      true,
    );


    try {
      const redirectTo =
        `${window.location.origin}/auth/login`;


      const {
        error,
      } =
        await supabase.auth
          .signUp({
            email:
              normalizedEmail,

            password,

            options: {
              emailRedirectTo:
                redirectTo,

              data: {
                name:
                  normalizedName,

                surname:
                  normalizedSurname,

                telefono:
                  normalizedPhone,
              },
            },
          });


      if (
        error
      ) {
        throw error;
      }


      setName(
        normalizedName,
      );

      setSurname(
        normalizedSurname,
      );

      setDone(
        true,
      );
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No pudimos crear la cuenta.",
      );
    } finally {
      setLoading(
        false,
      );
    }
  }


  /* =======================================================
   * REGISTRATION CONFIRMATION
   * ===================================================== */

  if (
    done
  ) {
    return (
      <div className="wayco-shell min-h-screen px-6 pt-10">
        <header className="flex items-center justify-between">
          <span />
        </header>


        <div className="mt-16 flex flex-col items-center text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              backgroundColor:
                "var(--green-bg)",
            }}
          >
            <Check
              className="h-8 w-8"
              style={{
                color:
                  "var(--green-primary)",
              }}
            />
          </div>


          <h1 className="mt-6 text-[22px] font-semibold">
            ¡Bienvenido/a a Wayco, {name}!
          </h1>


          <p className="mt-2 text-[14px] text-muted-foreground">
            Revisá tu email para confirmar tu cuenta y poder iniciar sesión.
          </p>


          <div
            className="mt-6 flex max-w-[360px] items-start gap-3 rounded-[14px] p-4 text-left"
            style={{
              backgroundColor:
                "var(--green-bg)",
            }}
          >
            <Car
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{
                color:
                  "var(--green-primary)",
              }}
            />

            <div>
              <p className="text-[14px] font-semibold text-foreground">
                ¿Querés publicar viajes?
              </p>

              <p className="mt-1 text-[13px] leading-[1.5] text-muted-foreground">
                Para publicar viajes como conductor necesitás registrar un
                vehículo y esperar su aprobación. Una vez creada tu cuenta,
                podés hacerlo desde tu perfil.
              </p>
            </div>
          </div>


          <div className="mt-8 w-full max-w-[360px]">
            <DelayedConfirmationButton
              onConfirm={() =>
                navigate({
                  to:
                    "/auth/login",
                })
              }
            />
          </div>
        </div>
      </div>
    );
  }


  /* =======================================================
   * REGISTRATION FORM
   * ===================================================== */

  return (
    <div className="wayco-shell min-h-screen px-6 pb-10 pt-6">
      <header className="flex items-center justify-between">
        <BackLink
          to="/welcome"
        />

        <h1 className="text-[18px] font-semibold">
          Crear cuenta
        </h1>

        <span />
      </header>


      <div className="mt-8 animate-wayco-fade">
        <GoogleAuthButton
          mode="register"
          termsAccepted={
            termsAccepted
          }
        />


        <div className="space-y-4">
          <Field
            label="Nombre"
            error={
              errors.name
            }
          >
            <input
              className="wayco-input"
              value={
                name
              }
              onChange={(
                event,
              ) =>
                setName(
                  event.target.value,
                )
              }
              placeholder="Ej: Nicolas"
              autoComplete="given-name"
              aria-invalid={
                !!errors.name
              }
            />
          </Field>


          <Field
            label="Apellido"
            error={
              errors.surname
            }
          >
            <input
              className="wayco-input"
              value={
                surname
              }
              onChange={(
                event,
              ) =>
                setSurname(
                  event.target.value,
                )
              }
              placeholder="Ej: Libré"
              autoComplete="family-name"
              aria-invalid={
                !!errors.surname
              }
            />
          </Field>


          <Field
            label="Email"
            error={
              errors.email
            }
          >
            <input
              className="wayco-input"
              type="email"
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
              autoCapitalize="none"
              autoComplete="email"
              aria-invalid={
                !!errors.email
              }
            />
          </Field>


          <Field
            label="Contraseña"
            error={
              errors.password
            }
          >
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
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                aria-invalid={
                  !!errors.password
                }
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
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                aria-label={
                  showPwd
                    ? "Ocultar"
                    : "Mostrar"
                }
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
          </Field>


          <Field
            label="Teléfono"
            error={
              errors.telefono
            }
            hint="Formato argentino: +54 9 11 1234 5678"
          >
            <input
              className="wayco-input"
              type="tel"
              value={
                telefono
              }
              onChange={(
                event,
              ) =>
                setTelefono(
                  event.target.value,
                )
              }
              placeholder="+54 9 ..."
              autoComplete="tel"
              aria-invalid={
                !!errors.telefono
              }
            />
          </Field>


          <TermsAndConditions
            accepted={
              termsAccepted
            }
            onAcceptedChange={
              setTermsAccepted
            }
          />


          <button
            type="button"
            className="wayco-btn wayco-btn-primary mt-2"
            disabled={
              !name ||
              !surname ||
              !email ||
              !password ||
              !telefono ||
              !termsAccepted ||
              loading
            }
            onClick={() => {
              void handleSignUp();
            }}
          >
            {loading
              ? "Creando cuenta…"
              : "Crear cuenta"}
          </button>


          {loading && (
            <WaycoFullScreenLoader />
          )}


          <p className="mt-4 text-center text-[14px] text-muted-foreground">
            ¿Ya tenés cuenta?{" "}

            <Link
              to="/auth/login"
              className="font-semibold"
              style={{
                color:
                  "var(--green-primary)",
              }}
            >
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


function Field({
  label,
  error,
  hint,
  children,
}: {
  label:
    string;

  error?:
    string;

  hint?:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] font-medium text-foreground">
        {label}
      </span>

      {children}

      {error
        ? (
          <span
            className="mt-1 block text-[12px]"
            style={{
              color:
                "var(--destructive)",
            }}
          >
            {error}
          </span>
        )
        : hint
          ? (
            <span className="mt-1 block text-[12px] text-muted-foreground">
              {hint}
            </span>
          )
          : null}
    </label>
  );
}
