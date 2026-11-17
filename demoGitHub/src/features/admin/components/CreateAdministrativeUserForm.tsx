import {
  useState,
  type FormEvent,
} from "react";

import {
  Eye,
  EyeOff,
  ShieldPlus,
  UserPlus,
} from "lucide-react";

import {
  personNameSchema,
} from "@wayco/shared/users";

import {
  toast,
} from "sonner";

import {
  use_create_administrative_user,
} from "../hooks/use_create_administrative_user";


export function CreateAdministrativeUserForm() {
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
    password,
    setPassword,
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
    showPassword,
    setShowPassword,
  ] =
    useState(
      false,
    );


  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();


    const parsedName =
      personNameSchema.safeParse(
        name,
      );

    if (!parsedName.success) {
      toast.error(
        parsedName.error.issues[0]
          ?.message ??
          "El nombre no es válido.",
      );

      return;
    }


    const parsedSurname =
      personNameSchema.safeParse(
        surname,
      );

    if (!parsedSurname.success) {
      toast.error(
        parsedSurname.error.issues[0]
          ?.message ??
          "El apellido no es válido.",
      );

      return;
    }


    const normalizedEmail =
      email
        .trim()
        .toLowerCase();


    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail,
      )
    ) {
      toast.error(
        "Ingresá un email válido.",
      );

      return;
    }


    if (
      password.length <
      8
    ) {
      toast.error(
        "La contraseña debe tener al menos 8 caracteres.",
      );

      return;
    }


    const normalizedPhone =
      phone.trim();

    if (
      normalizedPhone
        .replace(
          /\D/g,
          "",
        )
        .length <
      8
    ) {
      toast.error(
        "Ingresá un teléfono válido.",
      );

      return;
    }


    try {
      const createdUser =
        await create_user_mutation
          .mutateAsync({
            name:
              parsedName.data,

            surname:
              parsedSurname.data,

            email:
              normalizedEmail,

            password,

            phone:
              normalizedPhone,
          });


      toast.success(
        `${createdUser.name} ${createdUser.surname} fue creado como administrador.`,
      );


      setName(
        "",
      );

      setSurname(
        "",
      );

      setEmail(
        "",
      );

      setPassword(
        "",
      );

      setPhone(
        "",
      );

      setShowPassword(
        false,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo crear el administrador.",
      );
    }
  }


  return (
    <div className="rounded-[20px] border border-[#E5E4DF] bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F5F0] text-[#1D9E75]">
          <ShieldPlus className="h-5 w-5" />
        </span>

        <div>
          <h3 className="text-[16px] font-bold text-[#111110]">
            Nuevo administrador
          </h3>

          <p className="mt-1 text-[12px] leading-[1.5] text-[#6B6A66]">
            Creá una cuenta con acceso al panel administrativo de Wayco.
          </p>
        </div>
      </div>


      <form
        onSubmit={
          handleSubmit
        }
        className="mt-6 space-y-4"
      >
        <div>
          <label
            htmlFor="admin-name"
            className="mb-1.5 block text-[13px] font-semibold text-[#33322F]"
          >
            Nombre
          </label>

          <input
            id="admin-name"
            type="text"
            autoComplete="given-name"
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
            placeholder="Nicolás"
            className="h-12 w-full rounded-[12px] border border-[#DAD9D4] bg-white px-4 text-[14px] text-[#111110] outline-none transition focus:border-[#1D9E75] disabled:bg-[#F5F4F1]"
          />
        </div>


        <div>
          <label
            htmlFor="admin-surname"
            className="mb-1.5 block text-[13px] font-semibold text-[#33322F]"
          >
            Apellido
          </label>

          <input
            id="admin-surname"
            type="text"
            autoComplete="family-name"
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
            placeholder="Libré"
            className="h-12 w-full rounded-[12px] border border-[#DAD9D4] bg-white px-4 text-[14px] text-[#111110] outline-none transition focus:border-[#1D9E75] disabled:bg-[#F5F4F1]"
          />
        </div>


        <div>
          <label
            htmlFor="admin-email"
            className="mb-1.5 block text-[13px] font-semibold text-[#33322F]"
          >
            Email
          </label>

          <input
            id="admin-email"
            type="email"
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
            disabled={
              create_user_mutation.isPending
            }
            placeholder="admin@wayco.com"
            className="h-12 w-full rounded-[12px] border border-[#DAD9D4] bg-white px-4 text-[14px] text-[#111110] outline-none transition focus:border-[#1D9E75] disabled:bg-[#F5F4F1]"
          />
        </div>


        <div>
          <label
            htmlFor="admin-phone"
            className="mb-1.5 block text-[13px] font-semibold text-[#33322F]"
          >
            Teléfono
          </label>

          <input
            id="admin-phone"
            type="tel"
            autoComplete="tel"
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
            placeholder="54 9 221 555 1234"
            className="h-12 w-full rounded-[12px] border border-[#DAD9D4] bg-white px-4 text-[14px] text-[#111110] outline-none transition focus:border-[#1D9E75] disabled:bg-[#F5F4F1]"
          />
        </div>


        <div>
          <label
            htmlFor="admin-password"
            className="mb-1.5 block text-[13px] font-semibold text-[#33322F]"
          >
            Contraseña
          </label>

          <div className="relative">
            <input
              id="admin-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
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
              placeholder="Mínimo 8 caracteres"
              className="h-12 w-full rounded-[12px] border border-[#DAD9D4] bg-white px-4 pr-12 text-[14px] text-[#111110] outline-none transition focus:border-[#1D9E75] disabled:bg-[#F5F4F1]"
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
              className="absolute right-0 top-0 inline-flex h-12 w-12 items-center justify-center text-[#6B6A66]"
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

          <p className="mt-1.5 text-[11px] text-[#8A8882]">
            Debe contener al menos 8 caracteres.
          </p>
        </div>


        <div className="rounded-[12px] bg-[#F4FAF7] px-4 py-3">
          <p className="text-[12px] leading-[1.5] text-[#376A5B]">
            La cuenta quedará habilitada inmediatamente. No será necesario confirmar el email.
          </p>
        </div>


        <button
          type="submit"
          disabled={
            create_user_mutation.isPending
          }
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-[#1D9E75] px-4 text-[14px] font-bold text-white transition hover:bg-[#178461] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UserPlus className="h-4 w-4" />

          {create_user_mutation.isPending
            ? "Creando administrador…"
            : "Crear administrador"}
        </button>
      </form>
    </div>
  );
}