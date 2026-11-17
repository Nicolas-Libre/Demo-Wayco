import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  Car,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  RefreshCw,
  UserPlus,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  toast,
} from "sonner";

import type {
  AdminVehicle,
} from "@wayco/shared/admin";

import {
  AuthShell,
} from "@/components/layout/AuthShell";

import {
  AdminApprovedVehicleCard,
} from "@/features/admin/components/AdminApprovedVehicleCard";

import {
  AdminVehicleCard,
} from "@/features/admin/components/AdminVehicleCard";

import {
  AdminVehicleDecisionSheet,
} from "@/features/admin/components/AdminVehicleDecisionSheet";

import {
  use_approved_vehicles,
} from "@/features/admin/hooks/use_approved_vehicles";

import {
  use_pending_vehicles,
} from "@/features/admin/hooks/use_pending_vehicles";

import {
  use_disable_vehicle,
} from "@/features/admin/hooks/use_vehicle_validation";

import {
  use_current_user_capabilities,
} from "@/features/users/hooks/use_current_user_capabilities";

import {
  CreateAdministrativeUserForm,
} from "@/features/admin/components/CreateAdministrativeUserForm";

import {
  CreateAdministrativeUserSheet,
} from "@/features/admin/components/CreateAdministrativeUserSheet";


export const Route =
  createFileRoute(
    "/admin",
  )({
    head: () => ({
      meta: [
        {
          title:
            "Administración — Wayco",
        },
      ],
    }),

    component: () => (
      <AuthShell>
        <AdminPage />
      </AuthShell>
    ),
  });


function AdminPage() {
  const navigate =
    useNavigate();


  /* =======================================================
   * AUTHORIZATION
   * ===================================================== */

  const capabilities_query =
    use_current_user_capabilities();

  const isAdministrative =
    capabilities_query.data
      ?.isAdministrative ??
    false;


  /* =======================================================
   * QUERIES
   * ===================================================== */

  const pending_vehicles_query =
    use_pending_vehicles();

  const approved_vehicles_query =
    use_approved_vehicles();


  const pendingVehicles =
    pending_vehicles_query.data ??
    [];

  const approvedVehicles =
    approved_vehicles_query.data ??
    [];


  /* =======================================================
   * MUTATIONS
   * ===================================================== */

  const disable_vehicle_mutation =
    use_disable_vehicle();


  /* =======================================================
   * LOCAL STATE
   * ===================================================== */

  const [
    vehicleToDisable,
    setVehicleToDisable,
  ] =
    useState<
      AdminVehicle | null
    >(
      null,
    );

    const [
    createAdministrativeUserOpen,
    setCreateAdministrativeUserOpen,
  ] =
    useState(
      false,
    );


  /* =======================================================
   * ADMIN GUARD
   * ===================================================== */

  useEffect(() => {
    if (
      capabilities_query.isPending
    ) {
      return;
    }


    if (
      capabilities_query.isError ||
      !isAdministrative
    ) {
      void navigate({
        to:
          "/perfil",
      });
    }
  }, [
    capabilities_query.isPending,
    capabilities_query.isError,
    isAdministrative,
    navigate,
  ]);


  /* =======================================================
   * DISABLE VEHICLE
   * ===================================================== */

  async function handleDisableVehicle(
    reason:
      string,
  ) {
    if (
      !vehicleToDisable
    ) {
      return;
    }


    try {
      await disable_vehicle_mutation
        .mutateAsync({
          vehicle_id:
            vehicleToDisable.id,

          input: {
            reason,
          },
        });


      toast.success(
        "Vehículo dado de baja.",
      );


      setVehicleToDisable(
        null,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo dar de baja el vehículo.",
      );
    }
  }


  /* =======================================================
   * AUTHORIZATION LOADING
   * ===================================================== */

  if (
    capabilities_query.isPending
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[14px] text-[#6B6A66]">
          Verificando permisos…
        </p>
      </div>
    );
  }


  /* =======================================================
   * NOT ADMINISTRATIVE
   * ===================================================== */

  if (
    capabilities_query.isError ||
    !isAdministrative
  ) {
    return null;
  }


  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <div className="pb-8">
      {/* ===================================================
       * HEADER
       * ================================================= */}

      <header
        className="px-5 pb-7 pt-12"
        style={{
          background:
            "#04342C",
        }}
      >
        <p
          className="text-[12px] font-semibold uppercase tracking-wider"
          style={{
            color:
              "#9FE1CB",
          }}
        >
          Administración
        </p>

        <h1 className="mt-1 text-[24px] font-bold text-white">
          Panel de Wayco
        </h1>

        <p className="mt-1 max-w-[320px] text-[13px] leading-[1.5] text-white/60">
          Revisá solicitudes y gestioná la validación de vehículos.
        </p>
      </header>

             {/* ===================================================
       * ADMINISTRATIVE USERS
       * ================================================= */}

      <section className="px-5 pt-6">
        <button
          type="button"
          onClick={() =>
            setCreateAdministrativeUserOpen(
              true,
            )
          }
          className="flex w-full items-center gap-4 rounded-[14px] border border-[#CDE8DF] bg-white p-4 text-left transition-colors hover:bg-[#F8FAF9]"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F5F0] text-[#1D9E75]">
            <UserPlus className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-[#111110]">
              Crear administrativo
            </p>

            <p className="mt-0.5 text-[12px] leading-[1.5] text-[#6B6A66]">
              Registrá una nueva cuenta con permisos administrativos
            </p>
          </div>

          <ChevronRight className="h-5 w-5 shrink-0 text-[#B7B5AE]" />
        </button>
      </section>

      {/* ===================================================
       * PENDING VEHICLES
       * ================================================= */}

      <section className="px-5 pt-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-[#1D9E75]" />

              <h2 className="text-[18px] font-bold text-[#111110]">
                Vehículos pendientes
              </h2>
            </div>

            {!pending_vehicles_query.isPending &&
              !pending_vehicles_query.isError && (
                <p className="mt-1 text-[12px] text-[#6B6A66]">
                  {pendingVehicles.length ===
                  1
                    ? "1 solicitud pendiente"
                    : `${pendingVehicles.length} solicitudes pendientes`}
                </p>
              )}
          </div>


          <button
            type="button"
            onClick={() => {
              void pending_vehicles_query
                .refetch();
            }}
            disabled={
              pending_vehicles_query.isFetching
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F1ED] text-[#6B6A66] disabled:opacity-50"
            aria-label="Actualizar solicitudes pendientes"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                pending_vehicles_query.isFetching
                  ? "animate-spin"
                  : ""
              }`}
            />
          </button>
        </div>


        {pending_vehicles_query.isPending && (
          <div className="py-12 text-center">
            <p className="text-[14px] text-[#6B6A66]">
              Cargando solicitudes…
            </p>
          </div>
        )}


        {pending_vehicles_query.isError && (
          <div className="rounded-[14px] border border-red-300 bg-red-50 p-4">
            <p className="text-[14px] font-semibold text-red-700">
              No se pudieron cargar las solicitudes
            </p>

            <p className="mt-1 text-[12px] text-red-600">
              {
                pending_vehicles_query
                  .error
                  .message
              }
            </p>

            <button
              type="button"
              onClick={() => {
                void pending_vehicles_query
                  .refetch();
              }}
              className="mt-3 text-[13px] font-semibold text-red-700"
            >
              Reintentar
            </button>
          </div>
        )}


        {!pending_vehicles_query.isPending &&
          !pending_vehicles_query.isError &&
          pendingVehicles.length ===
            0 && (
            <div className="rounded-[20px] border border-[#E5E4DF] bg-white px-5 py-10 text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5F0]">
                <Car className="h-5 w-5 text-[#1D9E75]" />
              </span>

              <p className="mt-4 text-[15px] font-bold text-[#111110]">
                No hay solicitudes pendientes
              </p>

              <p className="mx-auto mt-1 max-w-[260px] text-[12px] leading-[1.5] text-[#6B6A66]">
                Cuando un usuario registre un vehículo nuevo,
                aparecerá acá para su revisión.
              </p>
            </div>
          )}


        {pendingVehicles.length >
          0 && (
          <div className="space-y-3">
            {pendingVehicles.map(
              (
                vehicle,
              ) => (
                <AdminVehicleCard
                  key={
                    vehicle.id
                  }
                  vehicle={
                    vehicle
                  }
                  onOpen={() =>
                    navigate({
                      to:
                        "/admin/vehicles/$vehicle_id",

                      params: {
                        vehicle_id:
                          vehicle.id,
                      },
                    })
                  }
                />
              ),
            )}
          </div>
        )}
      </section>


      {/* ===================================================
       * APPROVED VEHICLES
       * ================================================= */}

      <section className="px-5 pt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#1D9E75]" />

              <h2 className="text-[18px] font-bold text-[#111110]">
                Vehículos aprobados
              </h2>
            </div>

            {!approved_vehicles_query.isPending &&
              !approved_vehicles_query.isError && (
                <p className="mt-1 text-[12px] text-[#6B6A66]">
                  {approvedVehicles.length ===
                  1
                    ? "1 vehículo habilitado"
                    : `${approvedVehicles.length} vehículos habilitados`}
                </p>
              )}
          </div>


          <button
            type="button"
            onClick={() => {
              void approved_vehicles_query
                .refetch();
            }}
            disabled={
              approved_vehicles_query.isFetching
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F1ED] text-[#6B6A66] disabled:opacity-50"
            aria-label="Actualizar vehículos aprobados"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                approved_vehicles_query.isFetching
                  ? "animate-spin"
                  : ""
              }`}
            />
          </button>
        </div>


        {approved_vehicles_query.isPending && (
          <div className="py-12 text-center">
            <p className="text-[14px] text-[#6B6A66]">
              Cargando vehículos…
            </p>
          </div>
        )}


        {approved_vehicles_query.isError && (
          <div className="rounded-[14px] border border-red-300 bg-red-50 p-4">
            <p className="text-[14px] font-semibold text-red-700">
              No se pudieron cargar los vehículos aprobados
            </p>

            <p className="mt-1 text-[12px] text-red-600">
              {
                approved_vehicles_query
                  .error
                  .message
              }
            </p>

            <button
              type="button"
              onClick={() => {
                void approved_vehicles_query
                  .refetch();
              }}
              className="mt-3 text-[13px] font-semibold text-red-700"
            >
              Reintentar
            </button>
          </div>
        )}


        {!approved_vehicles_query.isPending &&
          !approved_vehicles_query.isError &&
          approvedVehicles.length ===
            0 && (
            <div className="rounded-[20px] border border-[#E5E4DF] bg-white px-5 py-10 text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5F0]">
                <CheckCircle2 className="h-5 w-5 text-[#1D9E75]" />
              </span>

              <p className="mt-4 text-[15px] font-bold text-[#111110]">
                No hay vehículos aprobados
              </p>

              <p className="mx-auto mt-1 max-w-[260px] text-[12px] leading-[1.5] text-[#6B6A66]">
                Los vehículos aprobados aparecerán acá para su
                seguimiento.
              </p>
            </div>
          )}


        {approvedVehicles.length >
          0 && (
          <div className="space-y-3">
            {approvedVehicles.map(
              (
                vehicle,
              ) => (
                <AdminApprovedVehicleCard
                  key={
                    vehicle.id
                  }
                  vehicle={
                    vehicle
                  }
                  onDocuments={() =>
                    navigate({
                      to:
                        "/admin/vehicles/$vehicle_id",

                      params: {
                        vehicle_id:
                          vehicle.id,
                      },
                    })
                  }
                  
                />
              ),
            )}
          </div>
        )}
      </section>


      {/* ===================================================
       * DISABLE VEHICLE
       * ================================================= */}
            <CreateAdministrativeUserSheet
        open={
          createAdministrativeUserOpen
        }
        onClose={() =>
          setCreateAdministrativeUserOpen(
            false,
          )
        }
      />
      
      <AdminVehicleDecisionSheet
        open={
          vehicleToDisable !==
          null
        }
        type="disable"
        loading={
          disable_vehicle_mutation.isPending
        }
        onClose={() => {
          if (
            disable_vehicle_mutation.isPending
          ) {
            return;
          }

          setVehicleToDisable(
            null,
          );
        }}
        onConfirm={
          handleDisableVehicle
        }
      />
    </div>
  );
}