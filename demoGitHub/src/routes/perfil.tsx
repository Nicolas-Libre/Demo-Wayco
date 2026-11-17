import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  useEffect,
  useState,
} from "react";

import isologoWayco from "@/assets/isologo-wayco.png";

import {
  AlertCircle,
  Bell,
  Building2,
  Car,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  Fuel,
  HelpCircle,
  Leaf,
  MessageSquare,
  Plus,
  Trash2,
  User as UserIcon,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  personNameSchema,
  type UpdateCurrentUserInput,
} from "@wayco/shared/users";

import type {
  MyVehicle,
} from "@wayco/shared/vehicles";

import {
  supabase,
} from "@/lib/supabase";

import {
  AuthShell,
} from "@/components/layout/AuthShell";

import {
  Avatar,
} from "@/components/data-display/UserAvatar";

import {
  SectionHeader,
} from "@/components/layout/SectionHeader";

import {
  BottomSheet,
} from "@/components/overlays/BottomSheet";

import {
  AddVehicleSheet,
} from "@/features/vehicles/components/AddVehicleSheet";

import {
  VehicleValidationBadge,
} from "@/features/vehicles/components/VehicleValidationBadge";

import {
  use_delete_vehicle,
} from "@/features/vehicles/hooks/use_delete_vehicle";

import {
  use_my_vehicles,
} from "@/features/vehicles/hooks/use_my_vehicles";

import {
  use_current_user,
} from "@/features/users/hooks/use_current_user";

import {
  use_current_user_capabilities,
} from "@/features/users/hooks/use_current_user_capabilities";

import {
  use_update_current_user,
} from "@/features/users/hooks/use_update_current_user";

import {
  useQueryClient,
} from "@tanstack/react-query";

import {
  AdminAccessCard,
} from "@/features/admin/components/AdminAccessCard";

import { use_user_reputation } from "@/features/users/hooks/use_user_reputation";


type PerfilSearch = {
  edit?:
    "cbu";
};


export const Route =
  createFileRoute(
    "/perfil",
  )({
    validateSearch: (
      search: Record<
        string,
        unknown
      >,
    ): PerfilSearch => ({
      edit:
        search.edit ===
        "cbu"
          ? "cbu"
          : undefined,
    }),

    head: () => ({
      meta: [
        {
          title:
            "Perfil — Wayco",
        },
      ],
    }),

    component: () => (
      <AuthShell>
        <PerfilPage />
      </AuthShell>
    ),
  });


type Perfil = {
  id:
    string;

  name:
    string;

  surname:
    string;

  email:
    string;

  phone:
    string;

  cbuAlias:
    string;

  totalTrips:
    number;

  averageRating:
    number;
};


function PerfilPage() {
  const navigate =
    useNavigate();

  const search =
    Route.useSearch();


  /* =======================================================
   * QUERIES
   * ===================================================== */

  const current_user_query =
    use_current_user();

  const reputation_query =
    use_user_reputation();

  const capabilities_query =
    use_current_user_capabilities();

  const vehicles_query =
    use_my_vehicles();

  const update_user_mutation =
    use_update_current_user();

  const delete_vehicle_mutation =
    use_delete_vehicle();

  const currentUser =
    current_user_query.data;

  const vehicles =
    vehicles_query.data ??
    [];

  const profileRoleLabel =
    capabilities_query.isPending ||
    vehicles_query.isPending
      ? null
      : capabilities_query.data
          ?.isAdministrative
        ? "Administrativo"
        : vehicles.some(
            (
              vehicle,
            ) =>
              vehicle.validationState ===
              "aprobado",
          )
          ? "Conductor / Pasajero"
          : "Pasajero";

  const queryClient =
    useQueryClient();


  /* =======================================================
   * LOCAL UI STATE
   * ===================================================== */

  const [
    editSheet,
    setEditSheet,
  ] =
    useState<
      null |
      "datos" |
      "cbu"
    >(
      null,
    );

  const [
    logoutSheet,
    setLogoutSheet,
  ] =
    useState(
      false,
    );

  const [
    draft,
    setDraft,
  ] =
    useState<
      Partial<Perfil>
    >(
      {},
    );

  const [
    addVehSheet,
    setAddVehSheet,
  ] =
    useState(
      false,
    );

  const [
    vehicleToUpdate,
    setVehicleToUpdate,
  ] =
    useState<
      MyVehicle | null
    >(
      null,
    );

    const [
  visibleVehicleReasonId,
  setVisibleVehicleReasonId,
] = useState<string | null>(
  null,
);

  /* =======================================================
   * DELETE VEHICLE STATE
   * ===================================================== */

  const [
    vehicleToDelete,
    setVehicleToDelete,
  ] =
    useState<
      MyVehicle | null
    >(
      null,
    );



  /* =======================================================
   * PROFILE ADAPTER
   * ===================================================== */

  const p: Perfil = {
    id:
      currentUser?.id ??
      "",

    name:
      currentUser?.name ??
      "",

    surname:
      currentUser?.surname ??
      "",

    email:
      currentUser?.email ??
      "",

    phone:
      currentUser?.phone ??
      "",

    cbuAlias:
      currentUser?.cbuAlias ??
      "",

    totalTrips:
      currentUser?.totalTrips ??
      0,

    averageRating:
      currentUser?.averageRating ??
      5,
  };


  /* =======================================================
   * OPEN CBU FROM /perfil?edit=cbu
   * ===================================================== */

  useEffect(() => {
    if (
      !currentUser ||
      search.edit !==
        "cbu"
    ) {
      return;
    }

    setDraft({
      id:
        currentUser.id,

      name:
        currentUser.name,

      surname:
        currentUser.surname,

      email:
        currentUser.email,

      phone:
        currentUser.phone ??
        "",

      cbuAlias:
        currentUser.cbuAlias ??
        "",

      totalTrips:
        currentUser.totalTrips,

      averageRating:
        currentUser.averageRating,
    });

    setEditSheet(
      "cbu",
    );
  }, [
    currentUser,
    search.edit,
  ]);


  /* =======================================================
   * PROFILE EDITING
   * ===================================================== */

  function openSheet(
    kind:
      | "datos"
      | "cbu",
  ) {
    setDraft({
      ...p,
    });

    setEditSheet(
      kind,
    );
  }


  async function saveDraft() {
    if (
      !editSheet
    ) {
      return;
    }

    try {
      let input:
        UpdateCurrentUserInput;

      if (
        editSheet ===
        "datos"
      ) {
        const nameResult =
          personNameSchema
            .safeParse(
              draft.name ??
              "",
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
              draft.surname ??
              "",
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


        const phone =
          draft.phone?.trim() ||
          null;


        input = {
          name:
            nameResult.data,

          surname:
            surnameResult.data,

          phone,
        };
      } else {
        const cbuAlias =
          draft.cbuAlias?.trim() ||
          null;

        input = {
          cbuAlias,
        };
      }

      await update_user_mutation
        .mutateAsync(
          input,
        );

      toast.success(
        "Guardado",
      );

      setEditSheet(
        null,
      );

      await current_user_query
        .refetch();

      if (
        search.edit ===
        "cbu"
      ) {
        navigate({
          to:
            "/perfil",

          search:
            {},
        });
      }
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los cambios.",
      );
    }
  }


  const saving =
    update_user_mutation.isPending;


  /* =======================================================
   * DELETE VEHICLE
   * ===================================================== */

  function openDeleteVehicle(
  vehicle:
    MyVehicle,
) {
  if (
    vehicle.validationState !==
    "aprobado"
  ) {
    return;
  }

  setVehicleToDelete(
    vehicle,
  );
}


  function closeDeleteVehicle() {
  if (
    delete_vehicle_mutation.isPending
  ) {
    return;
  }

  setVehicleToDelete(
    null,
  );
}


  async function confirmDeleteVehicle() {
    if (
      !vehicleToDelete ||
      delete_vehicle_mutation.isPending
    ) {
      return;
    }

    try {
      await delete_vehicle_mutation
        .mutateAsync(
          vehicleToDelete.id,
        );

      toast.success(
        "Vehículo eliminado",
        {
          description:
            "El vehículo ya no está disponible en tu cuenta.",
        },
      );

      setVehicleToDelete(
        null,
      );

    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el vehículo.",
      );
    }
  }


  /* =======================================================
   * LOGOUT
   * ===================================================== */

  async function logout() {
    const {
      error,
    } =
      await supabase.auth
        .signOut();

    if (
      error
    ) {
      toast.error(
        error.message,
      );

      return;
    }

    queryClient.clear();

    await navigate({
      to:
        "/welcome",
    });
  }


  /* =======================================================
   * LOADING / ERRORS
   * ===================================================== */

  if (
    current_user_query.isPending
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[14px] text-[#6B6A66]">
          Cargando perfil…
        </p>
      </div>
    );
  }


  if (
    current_user_query.isError
  ) {
    return (
      <div className="px-5 pt-10">
        <div className="rounded-[14px] border border-red-300 bg-red-50 p-4">
          <p className="text-[14px] font-semibold text-red-700">
            No se pudo cargar el perfil
          </p>

          <p className="mt-1 text-[13px] text-red-600">
            {
              current_user_query
                .error
                .message
            }
          </p>

          <button
            type="button"
            onClick={() =>
              current_user_query
                .refetch()
            }
            className="mt-3 text-[13px] font-semibold text-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }


  if (
    !currentUser
  ) {
    return (
      <div className="px-5 pt-10">
        <div className="rounded-[14px] border border-red-300 bg-red-50 p-4">
          <p className="text-[14px] font-semibold text-red-700">
            No se encontró el perfil
          </p>
        </div>
      </div>
    );
  }


  /* =======================================================
   * DERIVED DATA
   * ===================================================== */

  const co2Kg =
    Math.round(
      p.totalTrips *
        60 *
        0.12,
    );

  const fullName =
    `${p.name} ${p.surname}`
      .trim();


  const waycoId =
    p.id
      .replace(
        /-/g,
        "",
      )
      .slice(
        0,
        8,
      )
      .toUpperCase();


  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <div>
      {/* ===================================================
       * HEADER
       * ================================================= */}

      <div
        className="relative overflow-hidden px-5 pb-8 pt-12 text-center"
        style={{
          background:
            "#04342C",

          minHeight:
            360,
        }}
      >
        {/* ===============================================
         * WAYCO LOGO PATTERN
         * ============================================= */}

        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <WaycoBackgroundLogo
            className="absolute -left-8 top-2 h-[145px] w-[145px]"
            opacity={0.16}
          />

          <WaycoBackgroundLogo
            className="absolute -right-8 top-2 h-[145px] w-[145px]"
            opacity={0.16}
          />

          <WaycoBackgroundLogo
            className="absolute left-1/2 top-[45px] h-[300px] w-[260px] -translate-x-1/2"
            opacity={0.13}
          />

          <WaycoBackgroundLogo
            className="absolute -bottom-10 -left-8 h-[145px] w-[145px]"
            opacity={0.14}
          />

          <WaycoBackgroundLogo
            className="absolute -bottom-10 -right-8 h-[145px] w-[145px]"
            opacity={0.14}
          />
        </div>


        {/* ===============================================
         * PROFILE CONTENT
         * ============================================= */}

        <div className="relative z-10 flex flex-col items-center">
          <div
            className="rounded-full p-[3px] shadow-lg"
            style={{
              background:
                "white",
            }}
          >
            <Avatar
              name={
                fullName
              }
              size={
                108
              }
            />
          </div>


          <div className="mt-7">
            <p className="text-[29px] font-bold leading-none tracking-tight text-white">
              {fullName ||
                "—"}
            </p>

            <p
              className="mt-3 text-[15px] font-semibold"
              style={{
                color:
                  "#9FE1CB",
              }}
            >
              Wayco Member
            </p>

            <p
              className="mt-1 text-[15px]"
              style={{
                color:
                  "rgba(255,255,255,0.72)",
              }}
            >
              {p.email}
            </p>
          </div>

          {/* CO₂ AHORRADO */}

<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#9FE1CB]/40 bg-white/10 px-4 py-2">
  <Leaf className="h-4 w-4 text-[#9FE1CB]" />

  <span className="text-[13px] font-semibold text-white">
    {co2Kg} kg de CO₂ ahorrado
  </span>
</div>
          {profileRoleLabel && (
            <span
              className="mt-5 inline-flex items-center rounded-full border px-5 py-1.5 text-[13px] font-semibold"
              style={{
                background:
                  "rgba(255,255,255,0.08)",

                color:
                  "#9FE1CB",

                borderColor:
                  "rgba(159,225,203,0.45)",
              }}
            >
              {
                profileRoleLabel
              }
            </span>
          )}
        </div>
      </div>

      {/* ===================================================
 * REPUTATION
 * ================================================= */}

<section className="px-5 pt-7">
  <SectionHeader>
    Reputación (0 creditos)
  </SectionHeader>

  {reputation_query.isPending ? (
    <p className="text-[13px] text-[#6B6A66]">
      Cargando reputación…
    </p>
  ) : reputation_query.isError ? (
    <div className="rounded-[12px] border border-red-300 bg-red-50 p-4">
      <p className="text-[13px] text-red-700">
        No se pudo cargar tu reputación.
      </p>

      <button
        type="button"
        onClick={() => void reputation_query.refetch()}
        className="mt-2 text-[13px] font-semibold text-red-700"
      >
        Reintentar
      </button>
    </div>
  ) : (
    <div className="grid grid-cols-2 overflow-hidden rounded-[12px] border border-[#E2E0D8] bg-white">
      <Stat
        value={
          reputation_query.data.driverRating === null
            ? "—"
            : `★ ${reputation_query.data.driverRating.toFixed(2)}`
        }
        label="Score conductor"
      />

      <Stat
        value={
          reputation_query.data.passengerRating === null
            ? "—"
            : `★ ${reputation_query.data.passengerRating.toFixed(2)}`
        }
        label="Score pasajero"
        divider
      />

      <div className="border-t border-[#E2E0D8]">
        <Stat
          value={String(reputation_query.data.driverTrips)}
          label="Viajes conductor"
        />
      </div>

      <div className="border-t border-[#E2E0D8]">
        <Stat
          value={String(reputation_query.data.passengerTrips)}
          label="Viajes pasajero"
          divider
        />
      </div>
    </div>
  )}
</section>


      {/* ===================================================
       * WALLET
       * ================================================= */}

      <section className="px-5 pt-7">
        <SectionHeader>
          Billetera
        </SectionHeader>

        <SectionGroup>
          <Item
            icon={
              <CreditCard className="h-5 w-5" />
            }
            title="CBU / Alias"
            subtitle={
              p.cbuAlias ||
              "Sin alias cargado"
            }
            onClick={() =>
              openSheet(
                "cbu",
              )
            }
            primary
          />

          <Item
            icon={
              <Building2 className="h-5 w-5" />
            }
            title="Método de pago"
            subtitle="Transferencia bancaria"
          />
        </SectionGroup>
      </section>


      {/* ===================================================
       * ACTIVITY
       * ================================================= */}

      <section className="px-5 pt-6">
        <SectionHeader>
          Actividad
        </SectionHeader>

        <SectionGroup>
          <Item
            icon={
              <MessageSquare className="h-5 w-5" />
            }
            title="Mensajes"
            to="/inbox"
          />

          <Item
            icon={<Clock className="h-5 w-5" />}
            title="Historial de viajes"
            to="/historial-viajes"
          />
        </SectionGroup>
      </section>


      {/* ===================================================
       * IMPACT
       * ================================================= */}

      <section className="px-5 pt-6">
        <SectionHeader>
          Mi impacto
        </SectionHeader>

        <ImpactoPanel
          viajes={
            p.totalTrips
          }
          co2Kg={
            co2Kg
          }
        />
      </section>


      {/* ===================================================
       * VEHICLES
       * ================================================= */}

      <section className="px-5 pt-6">
        <SectionHeader>
          Mis vehículos
        </SectionHeader>

        {vehicles_query.isPending && (
          <p className="mb-3 text-[13px] text-[#6B6A66]">
            Cargando vehículos…
          </p>
        )}

        {vehicles_query.isError && (
          <div className="mb-3 rounded-[12px] border border-red-300 bg-red-50 p-3">
            <p className="text-[13px] text-red-700">
              No se pudieron cargar los vehículos.
            </p>

            <button
              type="button"
              onClick={() =>
                vehicles_query
                  .refetch()
              }
              className="mt-2 text-[12px] font-semibold text-red-700"
            >
              Reintentar
            </button>
          </div>
        )}

        <div className="space-y-2">
          {vehicles.map(
            (
              vehicle,
            ) => (
              <div
                key={
                  vehicle.id
                }
                className="rounded-[12px] border bg-white p-4"
                style={{
                  borderColor:
                    "#E2E0D8",
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background:
                        "#E8F5F0",
                    }}
                  >
                    <Car
                      className="h-4 w-4"
                      style={{
                        color:
                          "#1D9E75",
                      }}
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-[#111110]">
                      {
                        vehicle.brand
                      }{" "}
                      {
                        vehicle.model
                      }{" "}
                      {
                        vehicle.year
                      }
                    </p>

                    <p
                      className="mt-0.5 text-[12px] text-[#6B6A66]"
                      style={{
                        fontFamily:
                          "ui-monospace, SFMono-Regular, monospace",
                      }}
                    >
                      {
                        vehicle.licensePlate
                      }
                    </p>

                    <div className="mt-2">
                      <VehicleValidationBadge
                        status={
                          vehicle.validationState
                        }
                      />
                    </div>


                    {/* =======================================
 * REJECTED / DISABLED
 * ===================================== */}

{(
  vehicle.validationState ===
    "rechazado" ||
  vehicle.validationState ===
    "dado_de_baja"
) && (
  <>
    <div className="mt-2 flex items-center gap-4">
      <button
        type="button"
        onClick={() => {
          setVehicleToUpdate(
            vehicle,
          );

          setAddVehSheet(
            true,
          );
        }}
        className="text-[13px] font-semibold"
        style={{
          color:
            "#1D9E75",
        }}
      >
        Actualizar documentación
      </button>

      <button
        type="button"
        onClick={() => {
          setVisibleVehicleReasonId(
            (
              currentVehicleId,
            ) =>
              currentVehicleId ===
              vehicle.id
                ? null
                : vehicle.id,
          );
        }}
        className="text-[13px] font-semibold text-red-700"
      >
        {visibleVehicleReasonId ===
        vehicle.id
          ? "Ocultar motivo"
          : "Ver motivo"}
      </button>
    </div>

    {visibleVehicleReasonId ===
      vehicle.id && (
      <div className="mt-3 rounded-[12px] border border-red-200 bg-red-50 p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />

          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-red-800">
              {vehicle.validationState ===
              "rechazado"
                ? "Motivo del rechazo"
                : "Motivo de la baja"}
            </p>

            <p className="mt-1 whitespace-pre-wrap break-words text-[12px] leading-[1.5] text-red-700">
              {vehicle.validationState ===
              "rechazado"
                ? vehicle.rejectReason ??
                  "No se informó un motivo."
                : vehicle.disableReason ??
                  "No se informó un motivo."}
            </p>
          </div>
        </div>
      </div>
    )}
  </>
)}


                    {/* =======================================
                     * APPROVED — DELETE
                     * ===================================== */}

                    {vehicle.validationState ===
                      "aprobado" && (
                      <button
                        type="button"
                        onClick={() =>
                          openDeleteVehicle(
                            vehicle,
                          )
                        }
                        className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />

                        Eliminar vehículo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}

          <button
            type="button"
            onClick={() => {
              setVehicleToUpdate(
                null,
              );

              setAddVehSheet(
                true,
              );
            }}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border-2 border-dashed p-4 text-[14px] font-semibold"
            style={{
              borderColor:
                "#9FE1CB",

              color:
                "#1D9E75",
            }}
          >
            <Plus className="h-4 w-4" />

            Registrar vehículo
          </button>
        </div>
      </section>


      {/* ===================================================
       * ADMINISTRATION
       * ================================================= */}

      {capabilities_query.data
        ?.isAdministrative && (
        <section className="px-5 pt-6">
          <SectionHeader>
            Administración
          </SectionHeader>

          <AdminAccessCard />
        </section>
      )}


      {/* ===================================================
       * ACCOUNT
       * ================================================= */}

      <section className="px-5 pt-6">
        <SectionHeader>
          Mi cuenta
        </SectionHeader>

        <SectionGroup>
          <Item
            icon={
              <UserIcon className="h-5 w-5" />
            }
            title="Mis datos"
            onClick={() =>
              openSheet(
                "datos",
              )
            }
            primary
          />

          <Item
            icon={
              <Bell className="h-5 w-5" />
            }
            title="Notificaciones"
            subtitle="Activadas"
          />

          <Item
            icon={
              <HelpCircle className="h-5 w-5" />
            }
            title="Ayuda y soporte"
          />

          <Item
            icon={
              <FileText className="h-5 w-5" />
            }
            title="Términos y condiciones"
          />
        </SectionGroup>
      </section>


      {/* ===================================================
       * LOGOUT BUTTON
       * ================================================= */}

      <button
        type="button"
        onClick={() =>
          setLogoutSheet(
            true,
          )
        }
        className="mb-2 mt-8 block w-full py-4 text-center text-[14px] font-semibold"
        style={{
          color:
            "var(--destructive)",
        }}
      >
        Cerrar sesión
      </button>


      {/* ===================================================
       * PERSONAL DATA
       * ================================================= */}

      <BottomSheet
        open={
          editSheet ===
          "datos"
        }
        onClose={() =>
          setEditSheet(
            null,
          )
        }
        title="Mis datos"
      >
        <div className="space-y-4">
          <div>
            <span className="wayco-input-label">
              Wayco ID
            </span>

            <div className="flex items-center gap-2">
              <input
                className="wayco-input flex-1"
                value={
                  waycoId
                }
                readOnly
              />

              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard
                    .writeText(
                      waycoId,
                    );

                  toast.success(
                    "ID copiado",
                  );
                }}
                className="inline-flex h-[52px] w-12 items-center justify-center rounded-[12px]"
                style={{
                  background:
                    "#F2F1ED",
                }}
                aria-label="Copiar"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <span className="wayco-input-label">
              Nombre
            </span>

            <input
              className="wayco-input"
              value={
                draft.name ??
                ""
              }
              onChange={(
                event,
              ) =>
                setDraft({
                  ...draft,

                  name:
                    event.target
                      .value,
                })
              }
            />
          </div>


          <div>
            <span className="wayco-input-label">
              Apellido
            </span>

            <input
              className="wayco-input"
              value={
                draft.surname ??
                ""
              }
              onChange={(
                event,
              ) =>
                setDraft({
                  ...draft,

                  surname:
                    event.target
                      .value,
                })
              }
            />
          </div>


          <div>
            <span className="wayco-input-label">
              Teléfono
            </span>

            <input
              className="wayco-input"
              value={
                draft.phone ??
                ""
              }
              onChange={(
                event,
              ) =>
                setDraft({
                  ...draft,

                  phone:
                    event.target
                      .value,
                })
              }
            />
          </div>

          <button
            type="button"
            onClick={
              saveDraft
            }
            disabled={
              saving
            }
            className="wayco-btn wayco-btn-primary mt-2 disabled:opacity-50"
          >
            {saving
              ? "Guardando…"
              : "Guardar"}
          </button>
        </div>
      </BottomSheet>


      {/* ===================================================
       * CBU / ALIAS
       * ================================================= */}

      <BottomSheet
        open={
          editSheet ===
          "cbu"
        }
        onClose={() => {
          setEditSheet(
            null,
          );

          if (
            search.edit ===
            "cbu"
          ) {
            navigate({
              to:
                "/perfil",

              search:
                {},
            });
          }
        }}
        title="CBU / Alias"
      >
        <div className="space-y-4">
          <p className="text-[13px] text-[#6B6A66]">
            Cargá tu CBU o alias para que los pasajeros te puedan
            transferir.
          </p>

          <input
            className="wayco-input"
            placeholder="ej: wayco.manuel"
            value={
              draft.cbuAlias ??
              ""
            }
            onChange={(
              event,
            ) =>
              setDraft({
                ...draft,

                cbuAlias:
                  event.target
                    .value,
              })
            }
          />

          <button
            type="button"
            onClick={
              saveDraft
            }
            disabled={
              saving
            }
            className="wayco-btn wayco-btn-primary disabled:opacity-50"
          >
            {saving
              ? "Guardando…"
              : "Guardar"}
          </button>
        </div>
      </BottomSheet>


      {/* ===================================================
       * LOGOUT
       * ================================================= */}

      <BottomSheet
        open={
          logoutSheet
        }
        onClose={() =>
          setLogoutSheet(
            false,
          )
        }
        title="¿Cerrar sesión?"
      >
        <p className="text-[14px] text-[#6B6A66]">
          Vas a tener que volver a iniciar sesión para usar Wayco.
        </p>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={
              logout
            }
            className="wayco-btn wayco-btn-primary"
            style={{
              background:
                "var(--destructive)",
            }}
          >
            Sí, cerrar sesión
          </button>

          <button
            type="button"
            onClick={() =>
              setLogoutSheet(
                false,
              )
            }
            className="wayco-btn wayco-btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </BottomSheet>

{/* ===================================================
 * DELETE VEHICLE
 * ================================================= */}

<BottomSheet
  open={
    vehicleToDelete !==
    null
  }
  onClose={
    closeDeleteVehicle
  }
  title="¿Estas seguro de eliminar tu vehiculo.?"
>
  {vehicleToDelete && (
    <>
      <div className="rounded-[14px] border border-[#E2E0D8] bg-[#F8F7F4] p-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
            <Car className="h-5 w-5 text-[#1D9E75]" />
          </span>

          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-[#111110]">
              {vehicleToDelete.brand}{" "}
              {vehicleToDelete.model}{" "}
              {vehicleToDelete.year}
            </p>

            <p
              className="mt-0.5 text-[12px] text-[#6B6A66]"
              style={{
                fontFamily:
                  "ui-monospace, SFMono-Regular, monospace",
              }}
            >
              {vehicleToDelete.licensePlate}
            </p>
          </div>
        </div>
      </div>


      <div className="mt-4 flex items-start gap-3 rounded-[14px] border border-red-200 bg-red-50 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />

        <div>
          <p className="text-[14px] font-semibold text-red-800">
            Esta acción no se puede deshacer.
          </p>

          <p className="mt-1 text-[13px] leading-[1.55] text-red-700">
            El vehículo desaparecerá de tu lista y no podrás
            utilizarlo para publicar nuevos viajes. 
          </p>
        </div>
      </div>


      <div className="mt-6 space-y-">
        <button
          type="button"
          onClick={() => {
            void confirmDeleteVehicle();
          }}
          disabled={
            delete_vehicle_mutation.isPending
          }
          className="wayco-btn wayco-btn-primary disabled:opacity-50"
          style={{
            background:
              "var(--destructive)",
          }}
        >
          {delete_vehicle_mutation.isPending
            ? "Eliminando…"
            : "Sí, eliminar vehículo"}
        </button>

        <button
          type="button"
          onClick={
            closeDeleteVehicle
          }
          disabled={
            delete_vehicle_mutation.isPending
          }
          className="wayco-btn wayco-btn-secondary disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </>
  )}
</BottomSheet>


      {/* ===================================================
       * VEHICLES
       * ================================================= */}

      <AddVehicleSheet
        open={
          addVehSheet
        }
        mode={
          vehicleToUpdate
            ? "update_documents"
            : "create"
        }
        vehicle={
          vehicleToUpdate
        }
        onClose={() => {
          setAddVehSheet(
            false,
          );

          setVehicleToUpdate(
            null,
          );
        }}
        onCreated={() => {
          void vehicles_query
            .refetch();
        }}
        onUpdated={() => {
          setVehicleToUpdate(
            null,
          );

          void vehicles_query
            .refetch();
        }}
      />
    </div>
  );
}


function WaycoBackgroundLogo({
  className,
  opacity,
}: {
  className:
    string;

  opacity:
    number;
}) {
  const [
    processedLogo,
    setProcessedLogo,
  ] =
    useState<
      string | null
    >(
      null,
    );


  useEffect(() => {
    const image =
      new Image();


    image.src =
      isologoWayco;


    image.onload =
      () => {
        const canvas =
          document.createElement(
            "canvas",
          );


        canvas.width =
          image.naturalWidth;

        canvas.height =
          image.naturalHeight;


        const context =
          canvas.getContext(
            "2d",
          );


        if (
          !context
        ) {
          return;
        }


        context.drawImage(
          image,
          0,
          0,
        );


        const imageData =
          context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );


        const pixels =
          imageData.data;


        for (
          let index = 0;
          index < pixels.length;
          index += 4
        ) {
          const red =
            pixels[index] ??
            0;

          const green =
            pixels[index + 1] ??
            0;

          const blue =
            pixels[index + 2] ??
            0;


          const luminance =
            0.2126 *
              red +
            0.7152 *
              green +
            0.0722 *
              blue;


          if (
            luminance <
            135
          ) {
            pixels[index + 3] =
              0;

            continue;
          }


          pixels[index] =
            159;

          pixels[index + 1] =
            225;

          pixels[index + 2] =
            203;


          const normalizedOpacity =
            Math.min(
              255,
              Math.max(
                0,
                (
                  luminance -
                  135
                ) *
                  2.2,
              ),
            );


          pixels[index + 3] =
            normalizedOpacity;
        }


        context.putImageData(
          imageData,
          0,
          0,
        );


        setProcessedLogo(
          canvas.toDataURL(
            "image/png",
          ),
        );
      };
  }, []);


  if (
    !processedLogo
  ) {
    return null;
  }


  return (
    <img
      src={
        processedLogo
      }
      alt=""
      aria-hidden="true"
      className={
        className
      }
      draggable={
        false
      }
      style={{
        opacity,

        objectFit:
          "contain",
      }}
    />
  );
}

function Stat({
  value,
  label,
  divider,
}: {
  value:
    string;

  label:
    string;

  divider?:
    boolean;
}) {
  return (
    <div
      className={`py-[18px] text-center ${
        divider
          ? "border-l"
          : ""
      }`}
      style={
        divider
          ? {
              borderColor:
                "#E2E0D8",
            }
          : undefined
      }
    >
      <p className="text-[20px] font-bold text-[#111110]">
        {value}
      </p>

      <p
        className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#6B6A66]"
        style={{
          letterSpacing:
            "0.06em",
        }}
      >
        {label}
      </p>
    </div>
  );
}


function SectionGroup({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div
      className="overflow-hidden rounded-[12px] border bg-white"
      style={{
        borderColor:
          "#E2E0D8",
      }}
    >
      {children}
    </div>
  );
}


function Item({
  icon,
  title,
  subtitle,
  onClick,
  to,
  primary,
}: {
  icon:
    React.ReactNode;

  title:
    string;

  subtitle?:
    string;

  onClick?:
    () => void;

  to?:
    string;

  primary?:
    boolean;
}) {
  const content = (
    <div
      className="flex items-center gap-4 p-4"
      style={{
        borderTop:
          "1px solid #F2F1ED",
      }}
    >
      <span
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center"
        style={{
          color:
            primary
              ? "#1D9E75"
              : "#6B6A66",
        }}
      >
        <span
          style={{
            display:
              "inline-flex",
          }}
        >
          {icon}
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-[#111110]">
          {title}
        </p>

        {subtitle && (
          <p className="mt-0.5 truncate text-[12px] text-[#6B6A66]">
            {subtitle}
          </p>
        )}
      </div>

      {(onClick ||
        to) && (
        <ChevronRight className="h-5 w-5 text-[#D3D1C7]" />
      )}
    </div>
  );

  if (
    to
  ) {
    return (
      <Link
        to={
          to
        }
        className="block first:[&>div]:!border-t-0"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={
        onClick
      }
      disabled={
        !onClick
      }
      className="block w-full text-left first:[&>div]:!border-t-0 disabled:opacity-60"
    >
      {content}
    </button>
  );
}


function ImpactoPanel({
  viajes,
  co2Kg,
}: {
  viajes:
    number;

  co2Kg:
    number;
}) {
  const [
    open,
    setOpen,
  ] =
    useState(
      false,
    );

  return (
    <div
      className="overflow-hidden rounded-[12px]"
      style={{
        background:
          "#E8F5F0",
      }}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{
              background:
                "#1D9E75",
            }}
          >
            <Leaf
              className="h-5 w-5 text-white"
              strokeWidth={
                2
              }
            />
          </div>

          <div className="flex-1">
            <p
              className="text-[14px] font-semibold"
              style={{
                color:
                  "#0F6E56",
              }}
            >
              Compartiendo el camino ahorrás CO₂
            </p>

            <p
              className="mt-1 text-[13px]"
              style={{
                color:
                  "#0F6E56",
              }}
            >
              Con tus{" "}
              <strong>
                {viajes}
              </strong>{" "}
              viajes evitaste emitir ~
              <strong>
                {co2Kg} kg
              </strong>{" "}
              de CO₂.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setOpen(
              (
                value,
              ) =>
                !value,
            )
          }
          className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold"
          style={{
            color:
              "#0F6E56",
          }}
          aria-expanded={
            open
          }
        >
          {open
            ? "Menos información"
            : "Más información"}

          {open
            ? (
              <ChevronUp className="h-4 w-4" />
            )
            : (
              <ChevronDown className="h-4 w-4" />
            )}
        </button>
      </div>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{
          gridTemplateRows:
            open
              ? "1fr"
              : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div
            className="bg-white p-5"
            style={{
              borderTop:
                "1px solid #9FE1CB",

              borderRadius:
                "0 0 14px 14px",
            }}
          >
            <ImpactoLabel>
              Cómo lo calculamos
            </ImpactoLabel>

            <p
              className="mt-2 text-[13px] leading-[1.6]"
              style={{
                color:
                  "#4A4845",
              }}
            >
              Cada vez que completás un viaje compartido en Wayco,
              estimamos las emisiones de CO₂ que evitaste en base a
              tres variables: la distancia del trayecto, el factor de
              emisión del combustible y la cantidad de pasajeros que
              compartieron el auto.
            </p>

            <div
              className="mt-3 rounded-[10px] p-[14px]"
              style={{
                background:
                  "#F2F1ED",
              }}
            >
              <code
                className="block text-[13px]"
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, monospace",

                  color:
                    "#111110",
                }}
              >
                CO₂ evitado = distancia_km × factor_combustible ×
                (pasajeros / (pasajeros + 1))
              </code>
            </div>

            <div
              className="mt-3 space-y-1.5 text-[12px]"
              style={{
                color:
                  "#4A4845",
              }}
            >
              <p>
                <span
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, monospace",
                  }}
                >
                  distancia_km
                </span>{" "}
                — kilómetros recorridos en el trayecto
              </p>

              <p>
                <span
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, monospace",
                  }}
                >
                  factor_combustible
                </span>{" "}
                — kg de CO₂ por km según tipo de combustible
              </p>

              <p>
                <span
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, monospace",
                  }}
                >
                  pasajeros
                </span>{" "}
                — asientos ocupados por pasajeros (sin contar al
                conductor)
              </p>
            </div>


            <div className="mt-6">
              <ImpactoLabel>
                Factores de emisión utilizados
              </ImpactoLabel>

              <p
                className="mt-2 text-[13px] leading-[1.6]"
                style={{
                  color:
                    "#4A4845",
                }}
              >
                Los factores de emisión que usamos están basados en
                valores de referencia del IPCC (Panel
                Intergubernamental sobre Cambio Climático) y del
                Inventario Nacional de Gases de Efecto Invernadero de
                Argentina (SAyDS).
              </p>

              <div className="mt-3 space-y-2">
                {[
                  {
                    name:
                      "Nafta",

                    valor:
                      "0.192",
                  },

                  {
                    name:
                      "Diésel",

                    valor:
                      "0.209",
                  },

                  {
                    name:
                      "GNC",

                    valor:
                      "0.128",
                  },
                ].map(
                  (
                    combustible,
                  ) => (
                    <div
                      key={
                        combustible.name
                      }
                      className="flex items-center gap-3 rounded-[10px] border bg-white p-3"
                      style={{
                        borderColor:
                          "#E2E0D8",
                      }}
                    >
                      <span
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                        style={{
                          background:
                            "#E8F5F0",
                        }}
                      >
                        <Fuel
                          className="h-4 w-4"
                          style={{
                            color:
                              "#1D9E75",
                          }}
                        />
                      </span>

                      <span className="flex-1 text-[14px] font-medium text-[#111110]">
                        {
                          combustible.name
                        }
                      </span>

                      <span
                        className="text-[14px] font-semibold"
                        style={{
                          color:
                            "#1D9E75",
                        }}
                      >
                        {
                          combustible.valor
                        }
                      </span>

                      <span
                        className="text-[12px]"
                        style={{
                          color:
                            "#6B6A66",
                        }}
                      >
                        kg CO₂ / km*
                      </span>
                    </div>
                  ),
                )}
              </div>

              <p
                className="mt-3 text-[10px] italic"
                style={{
                  color:
                    "#9B9A96",

                  lineHeight:
                    1.6,
                }}
              >
                * Valores calculados para un vehículo promedio de
                1.600 cc con consumo de referencia de 8 L/100km para
                nafta/diésel y 10 m³/100km para GNC. Fuente: IPCC AR6
                (2021) y SAyDS Argentina.
              </p>
            </div>


            <div className="mt-6">
              <ImpactoLabel>
                El impacto en números
              </ImpactoLabel>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <ImpactoStat
                  numero="~11.5 kg"
                  desc="CO₂ emite un auto nafta promedio en el trayecto La Plata–CABA (solo)"
                />

                <ImpactoStat
                  numero="~5.3 kg"
                  desc="CO₂ por pasajero cuando viajan 3 personas en el mismo auto"
                />

                <ImpactoStat
                  numero="54%"
                  desc="de reducción de emisiones al pasar de viajar solo a compartir con 2 pasajeros"
                  className="col-span-2 sm:col-span-1"
                />
              </div>
            </div>


            <div className="mt-6">
              <ImpactoLabel>
                Transparencia sobre nuestro cálculo
              </ImpactoLabel>

              <p
                className="mt-2 text-[12px] italic"
                style={{
                  color:
                    "#6B6A66",

                  lineHeight:
                    1.6,
                }}
              >
                Esta estimación es aproximada. No contempla variables
                como el estado del tráfico en tiempo real, el desgaste
                del motor, el peso total del vehículo ni las
                condiciones climáticas, que pueden aumentar o reducir
                las emisiones reales entre un 10% y un 30%. Wayco
                utiliza estos valores como referencia educativa, no
                como medición certificada de huella de carbono.
              </p>
            </div>


            <div className="mt-6">
              <ImpactoLabel>
                Fuentes
              </ImpactoLabel>

              <ul
                className="mt-2 space-y-1.5 text-[11px]"
                style={{
                  color:
                    "#9B9A96",

                  lineHeight:
                    1.8,
                }}
              >
                {[
                  "IPCC Sixth Assessment Report (AR6), 2021 — Capítulo de transporte",

                  "Inventario Nacional de GEI — Secretaría de Ambiente y Desarrollo Sustentable de Argentina",

                  "Agencia Internacional de Energía (IEA) — Emissions from fuel combustion, 2023",
                ].map(
                  (
                    source,
                  ) => (
                    <li
                      key={
                        source
                      }
                      className="flex items-start gap-1.5"
                    >
                      <ExternalLink className="mt-0.5 h-[11px] w-[11px] shrink-0" />

                      <span>
                        {
                          source
                        }
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>


            <button
              type="button"
              onClick={() =>
                setOpen(
                  false,
                )
              }
              className="mt-6 flex w-full items-center justify-center gap-1 text-[13px] font-semibold"
              style={{
                color:
                  "#1D9E75",
              }}
            >
              Menos información

              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function ImpactoLabel({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <p
      className="text-[11px] font-semibold uppercase tracking-wider"
      style={{
        color:
          "#0F6E56",

        letterSpacing:
          "0.06em",
      }}
    >
      {
        children
      }
    </p>
  );
}


function ImpactoStat({
  numero,
  desc,
  className,
}: {
  numero:
    string;

  desc:
    string;

  className?:
    string;
}) {
  return (
    <div
      className={`rounded-[12px] p-[14px] text-center ${
        className ??
        ""
      }`}
      style={{
        background:
          "#E8F5F0",
      }}
    >
      <p
        className="text-[20px] font-bold"
        style={{
          color:
            "#1D9E75",
        }}
      >
        {
          numero
        }
      </p>

      <p
        className="mt-1 text-[11px]"
        style={{
          color:
            "#6B6A66",

          lineHeight:
            1.4,
        }}
      >
        {
          desc
        }
      </p>
    </div>
  );
}