import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  ArrowLeft,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  toast,
} from "sonner";

import {
  AuthShell,
} from "@/components/layout/AuthShell";

import {
  AdminVehicleDecisionSheet,
  type AdminVehicleDecisionType,
} from "@/features/admin/components/AdminVehicleDecisionSheet";

import {
  AdminVehicleDetails,
} from "@/features/admin/components/AdminVehicleDetails";

import {
  use_admin_vehicle,
} from "@/features/admin/hooks/use_admin_vehicle";

import {
  use_approve_vehicle,
  use_disable_vehicle,
  use_reject_vehicle,
} from "@/features/admin/hooks/use_vehicle_validation";

import {
  use_current_user_capabilities,
} from "@/features/users/hooks/use_current_user_capabilities";


export const Route =
  createFileRoute(
    "/admin_/vehicles/$vehicle_id",
  )({
    head: () => ({
      meta: [
        {
          title:
            "Revisión de vehículo — Wayco",
        },
      ],
    }),

    component: () => (
      <AuthShell>
        <AdminVehiclePage />
      </AuthShell>
    ),
  });


function AdminVehiclePage() {
  const navigate =
    useNavigate();

  const {
    vehicle_id,
  } =
    Route.useParams();


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
   * VEHICLE
   * ===================================================== */

  const vehicle_query =
    use_admin_vehicle(
      vehicle_id,
    );

  const approve_mutation =
    use_approve_vehicle();

  const reject_mutation =
    use_reject_vehicle();

  const disable_mutation =
    use_disable_vehicle();


  /* =======================================================
   * LOCAL STATE
   * ===================================================== */

  const [
    decision,
    setDecision,
  ] =
    useState<
      AdminVehicleDecisionType | null
    >(
      null,
    );


  const vehicle =
    vehicle_query.data;

  const decision_loading =
    reject_mutation.isPending ||
    disable_mutation.isPending;


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
   * APPROVE
   * ===================================================== */

  async function handleApprove() {
    try {
      await approve_mutation.mutateAsync(
        vehicle_id,
      );

      toast.success(
        "Vehículo aprobado.",
      );

      await navigate({
        to:
          "/admin",
      });
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo aprobar el vehículo.",
      );
    }
  }


  /* =======================================================
   * REJECT / DISABLE
   * ===================================================== */

  async function handleDecision(
    reason:
      string,
  ) {
    if (
      !decision
    ) {
      return;
    }

    try {
      if (
        decision ===
        "reject"
      ) {
        await reject_mutation.mutateAsync({
          vehicle_id,

          input: {
            reason,
          },
        });

        toast.success(
          "Solicitud rechazada.",
        );
      } else {
        await disable_mutation.mutateAsync({
          vehicle_id,

          input: {
            reason,
          },
        });

        toast.success(
          "Vehículo dado de baja.",
        );
      }

      setDecision(
        null,
      );

      await navigate({
        to:
          "/admin",
      });
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el vehículo.",
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
    <>
      <div className="pb-8">
        {/* =================================================
         * HEADER
         * =============================================== */}

        <header
          className="px-5 pb-5 pt-10"
          style={{
            background:
              "#04342C",
          }}
        >
          <button
            type="button"
            onClick={() =>
              navigate({
                to:
                  "/admin",
              })
            }
            className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <p
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{
              color:
                "#9FE1CB",
            }}
          >
            Administración
          </p>

          <h1 className="mt-1 text-[22px] font-bold text-white">
            Revisión de vehículo
          </h1>
        </header>


        {/* =================================================
         * CONTENT
         * =============================================== */}

        <main className="px-5 pt-5">
          {vehicle_query.isPending && (
            <div className="py-12 text-center">
              <p className="text-[14px] text-[#6B6A66]">
                Cargando vehículo…
              </p>
            </div>
          )}


          {vehicle_query.isError && (
            <div className="rounded-[14px] border border-red-300 bg-red-50 p-4">
              <p className="text-[14px] font-semibold text-red-700">
                No se pudo cargar el vehículo
              </p>

              <p className="mt-1 text-[12px] text-red-600">
                {
                  vehicle_query
                    .error
                    .message
                }
              </p>

              <button
                type="button"
                onClick={() => {
                  void vehicle_query.refetch();
                }}
                className="mt-3 text-[13px] font-semibold text-red-700"
              >
                Reintentar
              </button>
            </div>
          )}


          {vehicle && (
            <AdminVehicleDetails
              vehicle={
                vehicle
              }
              approving={
                approve_mutation.isPending
              }
              onApprove={() => {
                void handleApprove();
              }}
              onReject={() =>
                setDecision(
                  "reject",
                )
              }
              onDisable={() =>
                setDecision(
                  "disable",
                )
              }
            />
          )}
        </main>
      </div>


      {/* ===================================================
       * REJECT / DISABLE SHEET
       * ================================================= */}

      <AdminVehicleDecisionSheet
        open={
          decision !==
          null
        }
        type={
          decision ??
          "reject"
        }
        loading={
          decision_loading
        }
        onClose={() =>
          setDecision(
            null,
          )
        }
        onConfirm={(
          reason,
        ) => {
          void handleDecision(
            reason,
          );
        }}
      />
    </>
  );
}