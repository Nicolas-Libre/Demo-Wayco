
import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  useEffect,
  useState,
} from "react";

import {
  Car,
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
  WaycoLogo,
} from "@/components/branding/WaycoBrand";

import {
  get_current_user,
} from "@/features/users/api/get_current_user";

import {
  use_complete_current_user,
} from "@/features/users/hooks/use_complete_current_user";

import {
  ApiError,
} from "@/lib/api";


export const Route =
  createFileRoute(
    "/auth/complete-profile",
  )({
    head: () => ({
      meta: [
        {
          title:
            "Completá tu perfil — Wayco",
        },
      ],
    }),

    component:
      CompleteProfilePage,
  });


function CompleteProfilePage() {
  const navigate =
    useNavigate();

  const complete_profile_mutation =
    use_complete_current_user();

  const [
    ready,
    setReady,
  ] =
    useState(
      false,
    );

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


  useEffect(() => {
    async function initialize() {
      try {
        const {
          data: {
            user,
          },

          error,
        } =
          await supabase.auth
            .getUser();


        if (
          error
        ) {
          throw error;
        }


        if (
          !user
        ) {
          await navigate({
            to:
              "/welcome",
          });

          return;
        }


        const metadata =
          user.user_metadata ??
          {};


        const fullName =
          String(
            metadata.full_name ??
            metadata.name ??
            "",
          )
            .trim();


        const fullNameParts =
          fullName
            .split(
              /\s+/,
            )
            .filter(
              Boolean,
            );


        const googleName =
          String(
            metadata.given_name ??
            fullNameParts[0] ??
            "",
          )
            .trim();


        const googleSurname =
          String(
            metadata.family_name ??
            fullNameParts
              .slice(
                1,
              )
              .join(
                " ",
              ),
          )
            .trim();


        setName(
          googleName,
        );

        setSurname(
          googleSurname,
        );

        setEmail(
          user.email ??
          "",
        );


        try {
          const profile =
            await get_current_user();


          if (
            profile.phone
              ?.trim()
          ) {
            await navigate({
              to:
                "/auth/home",

              replace:
                true,
            });

            return;
          }


          setName(
            profile.name ||
            googleName,
          );

          setSurname(
            profile.surname ||
            googleSurname,
          );

          setEmail(
            profile.email ||
            user.email ||
            "",
          );

          setPhone(
            profile.phone ??
            "",
          );
        } catch (
          profileError
        ) {
          if (
            !(
              profileError instanceof
                ApiError &&
              profileError.status_code ===
                404
            )
          ) {
            throw profileError;
          }
        }


        setReady(
          true,
        );
      } catch (
        error
      ) {
        console.error(
          "Error preparando el perfil:",
          error,
        );


        toast.error(
          "No pudimos cargar los datos de tu perfil.",
        );


        await navigate({
          to:
            "/welcome",
        });
      }
    }


    void initialize();
  }, [
    navigate,
  ]);


  async function save() {
    const nameResult =
      personNameSchema
        .safeParse(
          name,
        );


    if (
      !nameResult.success
    ) {
      toast.error(
        `Nombre: ${
          nameResult.error
            .issues[0]
            ?.message ??
          "valor inválido."
        }`,
      );

      return;
    }


    const surnameResult =
      personNameSchema
        .safeParse(
          surname,
        );


    if (
      !surnameResult.success
    ) {
      toast.error(
        `Apellido: ${
          surnameResult.error
            .issues[0]
            ?.message ??
          "valor inválido."
        }`,
      );

      return;
    }


    const normalizedPhone =
      phone
        .trim();


    if (
      !normalizedPhone ||
      normalizedPhone
        .replace(
          /\D/g,
          "",
        )
        .length <
        8
    ) {
      toast.error(
        "Teléfono inválido",
      );

      return;
    }


    const normalizedEmail =
      email
        .trim()
        .toLowerCase();


    if (
      !normalizedEmail
    ) {
      toast.error(
        "No pudimos obtener tu email.",
      );

      return;
    }


    try {
      await complete_profile_mutation
        .mutateAsync({
          name:
            nameResult.data,

          surname:
            surnameResult.data,

          email:
            normalizedEmail,

          phone:
            normalizedPhone,
        });


      toast.success(
        "¡Listo!",
      );


      await navigate({
        to:
          "/auth/home",
      });
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No pudimos guardar tu perfil.",
      );
    }
  }


  if (
    !ready
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-[14px] text-[#6B6A66]">
          Cargando…
        </p>
      </main>
    );
  }


  return (
    <div className="wayco-shell min-h-screen px-6 pb-10 pt-8">
      <WaycoLogo />


      <div className="mt-8 animate-wayco-fade">
        <h1 className="text-[22px] font-bold tracking-tight">
          Un último paso
        </h1>

        <p
          className="mt-1 text-[14px]"
          style={{
            color:
              "#6B6A66",
          }}
        >
          Completá tu perfil para empezar a usar Wayco.
        </p>


        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[14px] font-medium">
              Nombre
            </span>

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
            />
          </label>


          <label className="block">
            <span className="mb-1.5 block text-[14px] font-medium">
              Apellido
            </span>

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
            />
          </label>


          <label className="block">
            <span className="mb-1.5 block text-[14px] font-medium">
              Teléfono
            </span>

            <input
              className="wayco-input"
              type="tel"
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
              placeholder="+54 9 ..."
              autoComplete="tel"
            />

            <span className="mt-1 block text-[12px] text-muted-foreground">
              Formato argentino: +54 9 11 1234 5678
            </span>
          </label>


          <div
            className="rounded-[14px] p-4"
            style={{
              backgroundColor:
                "var(--green-bg)",
            }}
          >
            <div className="flex items-start gap-3">
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
                  vehículo y esperar su aprobación. Podés hacerlo desde tu
                  perfil una vez completada tu cuenta.
                </p>
              </div>
            </div>
          </div>


          <button
            type="button"
            className="wayco-btn wayco-btn-primary mt-2"
            disabled={
              !name ||
              !surname ||
              !phone ||
              complete_profile_mutation
                .isPending
            }
            onClick={() => {
              void save();
            }}
          >
            {complete_profile_mutation
              .isPending
              ? "Guardando…"
              : "Listo, empezar"}
          </button>
        </div>
      </div>
    </div>
  );
}
