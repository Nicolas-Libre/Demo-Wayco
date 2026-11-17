import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  personNameSchema,
} from "@wayco/shared/users";

import {
  BottomSheet,
} from "@/components/overlays/BottomSheet";

import {
  use_create_administrative_user,
} from "../hooks/use_create_administrative_user";

import {
  AdministrativeUserConfirmationOverlay,
} from "./AdministrativeUserConfirmationOverlay";


type CreateAdministrativeUserSheetProps = {
  open:
    boolean;

  onClose:
    () => void;
};


type CreatedAdministrativeUser = {
  name:
    string;

  surname:
    string;

  email:
    string;
};


export function CreateAdministrativeUserSheet({
  open,
  onClose,
}: CreateAdministrativeUserSheetProps) {
  const create_user_mutation =
    use_create_administrative_user();


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
    phone,
    setPhone,
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
    showPassword,
    setShowPassword,
  ] =
    useState(
      false,
    );

  const [
    createdUser,
    setCreatedUser,
  ] =
    useState<
      CreatedAdministrativeUser | null
    >(
      null,
    );


  /* =======================================================
   * RESET AFTER FULL CLOSE
   * ===================================================== */

  useEffect(() => {
    if (
      open ||
      createdUser
    ) {
      return;
    }


    const timeout =
      window.setTimeout(
        () => {
          resetForm();
        },
        200,
      );


    return () =>
      window.clearTimeout(
        timeout,
      );
  }, [
    open,
    createdUser,
  ]);


  /* =======================================================
   * FORM VALIDATION
   * ===================================================== */

  const parsedName =
    personNameSchema.safeParse(
      name,
    );

  const parsedSurname =
    personNameSchema.safeParse(
      surname,
    );

  const normalizedEmail =
    email
      .trim()
      .toLowerCase();

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalizedEmail,
    );

  const phoneValid =
    phone
      .replace(
        /\D/g,
        "",
      )
      .length >=
    8;

  const passwordValid =
    password.length >=
    8;


  const formValid =
    parsedName.success &&
    parsedSurname.success &&
    emailValid &&
    phoneValid &&
    passwordValid;


  /* =======================================================
   * SUBMIT
   * ===================================================== */

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();


    if (!formValid) {
      toast.error(
        "Revisá los datos ingresados.",
      );

      return;
    }


    if (
      !parsedName.success ||
      !parsedSurname.success
    ) {
      return;
    }


    try {
      const created =
        await create_user_mutation
          .mutateAsync({
            name:
              parsedName.data,

            surname:
              parsedSurname.data,

            email:
              normalizedEmail,

            phone:
              phone.trim(),

            password,
          });


      setCreatedUser({
        name:
          created.name,

        surname:
          created.surname,

        email:
          created.email,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo crear el usuario administrativo.",
      );
    }
  }


  /* =======================================================
   * CONFIRMATION CLOSE
   * ===================================================== */

  function closeConfirmation() {
    setCreatedUser(
      null,
    );

    onClose();
  }


  /* =======================================================
   * RESET
   * ===================================================== */

  function resetForm() {
    setName(
      "",
    );

    setSurname(
      "",
    );

    setEmail(
      "",
    );

    setPhone(
      "",
    );

    setPassword(
      "",
    );

    setShowPassword(
      false,
    );
  }


  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <>
      <BottomSheet
        open={
          open &&
          !createdUser
        }
        onClose={() => {
          if (
            create_user_mutation.isPending
          ) {
            return;
          }

          onClose();
        }}
        tall
      >
        {/* =================================================
         * HEADER
         * =============================================== */}

        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5F0] text-[#1D9E75]">
              <ShieldCheck className="h-5 w-5" />
            </span>

            <div>
              <h2 className="text-[20px] font-bold text-[#111110]">
                Crear administrativo
              </h2>
            </div>
          </div>

          <p className="mt-3 text-[13px] leading-[1.5] text-[#6B6A66]">
            Registrá una nueva cuenta con acceso al panel administrativo de Wayco.
          </p>
        </div>


        {/* =================================================
         * FORM
         * =============================================== */}

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-6"
        >
          <div className="space-y-4">
            <Field label="Nombre *">
              <input
                className="wayco-input"
                type="text"
                autoComplete="given-name"
                placeholder="Nombre"
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
                disabled={
                  create_user_mutation.isPending
                }
              />
            </Field>


            <Field label="Apellido *">
              <input
                className="wayco-input"
                type="text"
                autoComplete="family-name"
                placeholder="Apellido"
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
                disabled={
                  create_user_mutation.isPending
                }
              />
            </Field>


            <Field label="Email *">
              <input
                className="wayco-input"
                type="email"
                autoComplete="email"
                placeholder="administrador@email.com"
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
                disabled={
                  create_user_mutation.isPending
                }
              />
            </Field>


            <Field label="Teléfono *">
              <input
                className="wayco-input"
                type="tel"
                autoComplete="tel"
                placeholder="54 9 221 555 1234"
                value={
                  phone
                }
                onChange={(
                  event,
                ) =>
                  setPhone(
                    event.target.value,
                  )
                }
                disabled={
                  create_user_mutation.isPending
                }
              />
            </Field>


            <Field label="Contraseña *">
              <div className="relative">
                <input
                  className="wayco-input pr-12"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
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
                  disabled={
                    create_user_mutation.isPending
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (
                        current,
                      ) =>
                        !current,
                    )
                  }
                  disabled={
                    create_user_mutation.isPending
                  }
                  className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-[#6B6A66]"
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="mt-1 text-[11px] text-[#9B9A96]">
                Debe contener al menos 8 caracteres.
              </p>
            </Field>
          </div>


          {/* =================================================
           * INFORMATION
           * =============================================== */}

          <div className="mt-5 rounded-[12px] border border-[#CDE8DF] bg-[#F4FAF7] px-4 py-3">
            <p className="text-[12px] leading-[1.5] text-[#376A5B]">
              La cuenta quedará habilitada inmediatamente y podrá iniciar sesión con el email y la contraseña ingresados.
            </p>
          </div>


          {/* =================================================
           * ACTIONS
           * =============================================== */}

          <div className="mt-6 space-y-2">
            <button
              type="submit"
              disabled={
                !formValid ||
                create_user_mutation.isPending
              }
              className="wayco-btn wayco-btn-primary disabled:opacity-40"
            >
              {create_user_mutation.isPending
                ? "Creando…"
                : "Crear administrativo"}
            </button>

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                create_user_mutation.isPending
              }
              className="wayco-btn wayco-btn-secondary disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </BottomSheet>


      {/* ===================================================
       * CONFIRMATION
       * ================================================= */}

      {createdUser && (
        <AdministrativeUserConfirmationOverlay
          name={
            createdUser.name
          }
          surname={
            createdUser.surname
          }
          email={
            createdUser.email
          }
          onClose={
            closeConfirmation
          }
        />
      )}
    </>
  );
}


/* =========================================================
 * FIELD
 * ======================================================= */

function Field({
  label,
  children,
}: {
  label:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="wayco-input-label">
        {label}
      </span>

      <div className="mt-1">
        {children}
      </div>
    </label>
  );
}