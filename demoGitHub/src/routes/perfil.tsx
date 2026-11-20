import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  Bell,
  Car,
  Copy,
  FileText,
  HelpCircle,
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

import { PerfilReputation } from "@/features/perfil/components/PerfilReputation";
import { PerfilHeader } from "@/features/perfil/components/PerfilHeader";
import { PerfilWallet } from "@/features/perfil/components/PerfilWallet";
import { PerfilActivity } from "@/features/perfil/components/PerfilActivity";
import { PerfilImpact } from "@/features/perfil/components/PerfilImpact";
import { PerfilItem } from "@/features/perfil/components/PerfilItem";
import { PerfilSectionGroup } from "@/features/perfil/components/PerfilSectionGroup";

type PerfilSearch = {
  edit?: "cbu";
};

export const Route = createFileRoute("/perfil")({
  validateSearch: (
    search: Record<string, unknown>,
  ): PerfilSearch => ({
    edit:
      search.edit === "cbu"
        ? "cbu"
        : undefined,
  }),

  head: () => ({
    meta: [
      {
        title: "Perfil — Wayco",
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
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  cbuAlias: string;
  totalTrips: number;
  averageRating: number;
};

function PerfilPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  /* =======================================================
   * QUERIES
   * ===================================================== */

  const current_user_query =
    use_current_user();

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
    vehicles_query.data ?? [];

  const profileRoleLabel =
    capabilities_query.isPending ||
    vehicles_query.isPending
      ? null
      : capabilities_query.data?.isAdministrative
        ? "Administrativo"
        : vehicles.some(
            (vehicle) =>
              vehicle.validationState === "aprobado",
          )
          ? "Conductor / Pasajero"
          : "Pasajero";

  const queryClient = useQueryClient();

  /* =======================================================
   * LOCAL UI STATE
   * ===================================================== */

  const [
    editSheet,
    setEditSheet,
  ] = useState<null | "datos" | "cbu">(null);

  const [
    logoutSheet,
    setLogoutSheet,
  ] = useState(false);

  const [
    draft,
    setDraft,
  ] = useState<Partial<Perfil>>({});

  const [
    addVehSheet,
    setAddVehSheet,
  ] = useState(false);

  const [
    vehicleToUpdate,
    setVehicleToUpdate,
  ] = useState<MyVehicle | null>(null);

  const [
    visibleVehicleReasonId,
    setVisibleVehicleReasonId,
  ] = useState<string | null>(null);

  /* =======================================================
   * DELETE VEHICLE STATE
   * ===================================================== */

  const [
    vehicleToDelete,
    setVehicleToDelete,
  ] = useState<MyVehicle | null>(null);

  /* =======================================================
   * PROFILE ADAPTER
   * ===================================================== */

  const p: Perfil = {
    id: currentUser?.id ?? "",
    name: currentUser?.name ?? "",
    surname: currentUser?.surname ?? "",
    email: currentUser?.email ?? "",
    phone: currentUser?.phone ?? "",
    cbuAlias: currentUser?.cbuAlias ?? "",
    totalTrips: currentUser?.totalTrips ?? 0,
    averageRating: currentUser?.averageRating ?? 5,
  };

  /* =======================================================
   * OPEN CBU FROM /perfil?edit=cbu
   * ===================================================== */

  useEffect(() => {
    if (
      !currentUser ||
      search.edit !== "cbu"
    ) {
      return;
    }

    setDraft({
      id: currentUser.id,
      name: currentUser.name,
      surname: currentUser.surname,
      email: currentUser.email,
      phone: currentUser.phone ?? "",
      cbuAlias: currentUser.cbuAlias ?? "",
      totalTrips: currentUser.totalTrips,
      averageRating: currentUser.averageRating,
    });

    setEditSheet("cbu");
  }, [
    currentUser,
    search.edit,
  ]);

  /* =======================================================
   * PROFILE EDITING
   * ===================================================== */

  function openSheet(
    kind: "datos" | "cbu",
  ) {
    setDraft({
      ...p,
    });

    setEditSheet(kind);
  }

  async function saveDraft() {
    if (!editSheet) {
      return;
    }

    try {
      let input: UpdateCurrentUserInput;

      if (editSheet === "datos") {
        const nameResult =
          personNameSchema.safeParse(
            draft.name ?? "",
          );

        if (!nameResult.success) {
          toast.error(
            `Nombre: ${
              nameResult.error.issues[0]?.message ??
              "valor inválido."
            }`,
          );

          return;
        }

        const surnameResult =
          personNameSchema.safeParse(
            draft.surname ?? "",
          );

        if (!surnameResult.success) {
          toast.error(
            `Apellido: ${
              surnameResult.error.issues[0]?.message ??
              "valor inválido."
            }`,
          );

          return;
        }

        const phone =
          draft.phone?.trim() || null;

        input = {
          name: nameResult.data,
          surname: surnameResult.data,
          phone,
        };
      } else {
        const cbuAlias =
          draft.cbuAlias?.trim() || null;

        input = {
          cbuAlias,
        };
      }

      await update_user_mutation.mutateAsync(
        input,
      );

      toast.success("Guardado");

      setEditSheet(null);

      await current_user_query.refetch();

      if (search.edit === "cbu") {
        navigate({
          to: "/perfil",
          search: {},
        });
      }
    } catch (error) {
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
    vehicle: MyVehicle,
  ) {
    if (
      vehicle.validationState !== "aprobado"
    ) {
      return;
    }

    setVehicleToDelete(vehicle);
  }

  function closeDeleteVehicle() {
    if (
      delete_vehicle_mutation.isPending
    ) {
      return;
    }

    setVehicleToDelete(null);
  }

  async function confirmDeleteVehicle() {
    if (
      !vehicleToDelete ||
      delete_vehicle_mutation.isPending
    ) {
      return;
    }

    try {
      await delete_vehicle_mutation.mutateAsync(
        vehicleToDelete.id,
      );

      toast.success(
        "Vehículo eliminado",
        {
          description:
            "El vehículo ya no está disponible en tu cuenta.",
        },
      );

      setVehicleToDelete(null);
    } catch (error) {
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
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    queryClient.clear();

    await navigate({
      to: "/welcome",
    });
  }

  /* =======================================================
   * LOADING / ERRORS
   * ===================================================== */

  if (current_user_query.isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[14px] text-[#6B6A66]">
          Cargando perfil…
        </p>
      </div>
    );
  }

  if (current_user_query.isError) {
    return (
      <div className="px-5 pt-10">
        <div className="rounded-[14px] border border-red-300 bg-red-50 p-4">
          <p className="text-[14px] font-semibold text-red-700">
            No se pudo cargar el perfil
          </p>

          <p className="mt-1 text-[13px] text-red-600">
            {
              current_user_query.error.message
            }
          </p>

          <button
            type="button"
            onClick={() =>
              current_user_query.refetch()
            }
            className="mt-3 text-[13px] font-semibold text-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
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
    p.totalTrips *
    60 *
    0.12;

  const fullName =
    `${p.name} ${p.surname}`.trim();

  const waycoId =
    p.id
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase();

  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <div>
      {/* ===================================================
       * HEADER
       * ================================================= */}

      <PerfilHeader
        fullName={fullName}
        email={p.email}
        co2Kg={co2Kg}
        profileRoleLabel={profileRoleLabel}
      />

      {/* ===================================================
       * REPUTATION
       * ================================================= */}

      <PerfilReputation />

      {/* ===================================================
       * WALLET
       * ================================================= */}

      <PerfilWallet
        cbuAlias={p.cbuAlias}
        onEditCbu={() => openSheet("cbu")}
      />

      {/* ===================================================
       * ACTIVITY
       * ================================================= */}

      <PerfilActivity />

      {/* ===================================================
       * IMPACT
       * ================================================= */}

      <section className="px-5 pt-6">
        <SectionHeader>
          Mi impacto
        </SectionHeader>

        <PerfilImpact
          viajes={p.totalTrips}
          co2Kg={co2Kg}
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
                vehicles_query.refetch()
              }
              className="mt-2 text-[12px] font-semibold text-red-700"
            >
              Reintentar
            </button>
          </div>
        )}

        <div className="space-y-2">
          {vehicles.map(
            (vehicle) => (
              <div
                key={vehicle.id}
                className="rounded-[12px] border bg-white p-4"
                style={{
                  borderColor: "#E2E0D8",
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: "#E8F5F0",
                    }}
                  >
                    <Car
                      className="h-4 w-4"
                      style={{
                        color: "#1D9E75",
                      }}
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-[#111110]">
                      {vehicle.brand}{" "}
                      {vehicle.model}{" "}
                      {vehicle.year}
                    </p>

                    <p
                      className="mt-0.5 text-[12px] text-[#6B6A66]"
                      style={{
                        fontFamily:
                          "ui-monospace, SFMono-Regular, monospace",
                      }}
                    >
                      {vehicle.licensePlate}
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
                      vehicle.validationState === "rechazado" ||
                      vehicle.validationState === "dado_de_baja"
                    ) && (
                      <>
                        <div className="mt-2 flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setVehicleToUpdate(vehicle);
                              setAddVehSheet(true);
                            }}
                            className="text-[13px] font-semibold"
                            style={{
                              color: "#1D9E75",
                            }}
                          >
                            Actualizar documentación
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setVisibleVehicleReasonId(
                                (currentVehicleId) =>
                                  currentVehicleId === vehicle.id
                                    ? null
                                    : vehicle.id,
                              );
                            }}
                            className="text-[13px] font-semibold text-red-700"
                          >
                            {visibleVehicleReasonId === vehicle.id
                              ? "Ocultar motivo"
                              : "Ver motivo"}
                          </button>
                        </div>

                        {visibleVehicleReasonId === vehicle.id && (
                          <div className="mt-3 rounded-[12px] border border-red-200 bg-red-50 p-3">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />

                              <div className="min-w-0">
                                <p className="text-[13px] font-semibold text-red-800">
                                  {vehicle.validationState === "rechazado"
                                    ? "Motivo del rechazo"
                                    : "Motivo de la baja"}
                                </p>

                                <p className="mt-1 whitespace-pre-wrap break-words text-[12px] leading-[1.5] text-red-700">
                                  {vehicle.validationState === "rechazado"
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

                    {vehicle.validationState === "aprobado" && (
                      <button
                        type="button"
                        onClick={() =>
                          openDeleteVehicle(vehicle)
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
              setVehicleToUpdate(null);
              setAddVehSheet(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border-2 border-dashed p-4 text-[14px] font-semibold"
            style={{
              borderColor: "#9FE1CB",
              color: "#1D9E75",
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

      {capabilities_query.data?.isAdministrative && (
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

        <PerfilSectionGroup>
          <PerfilItem
            icon={
              <UserIcon className="h-5 w-5" />
            }
            title="Mis datos"
            onClick={() =>
              openSheet("datos")
            }
            primary
          />

          <PerfilItem
            icon={
              <Bell className="h-5 w-5" />
            }
            title="Notificaciones"
            subtitle="Activadas"
          />

          <PerfilItem
            icon={
              <HelpCircle className="h-5 w-5" />
            }
            title="Ayuda y soporte"
          />

          <PerfilItem
            icon={
              <FileText className="h-5 w-5" />
            }
            title="Términos y condiciones"
          />
        </PerfilSectionGroup>
      </section>

      {/* ===================================================
       * LOGOUT BUTTON
       * ================================================= */}

      <button
        type="button"
        onClick={() =>
          setLogoutSheet(true)
        }
        className="mb-2 mt-8 block w-full py-4 text-center text-[14px] font-semibold"
        style={{
          color: "var(--destructive)",
        }}
      >
        Cerrar sesión
      </button>

      {/* ===================================================
       * PERSONAL DATA
       * ================================================= */}

      <BottomSheet
        open={editSheet === "datos"}
        onClose={() =>
          setEditSheet(null)
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
                value={waycoId}
                readOnly
              />

              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(
                    waycoId,
                  );

                  toast.success("ID copiado");
                }}
                className="inline-flex h-[52px] w-12 items-center justify-center rounded-[12px]"
                style={{
                  background: "#F2F1ED",
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
              value={draft.name ?? ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  name: event.target.value,
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
              value={draft.surname ?? ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  surname: event.target.value,
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
              value={draft.phone ?? ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  phone: event.target.value,
                })
              }
            />
          </div>

          <button
            type="button"
            onClick={saveDraft}
            disabled={saving}
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
        open={editSheet === "cbu"}
        onClose={() => {
          setEditSheet(null);

          if (search.edit === "cbu") {
            navigate({
              to: "/perfil",
              search: {},
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
            value={draft.cbuAlias ?? ""}
            onChange={(event) =>
              setDraft({
                ...draft,
                cbuAlias: event.target.value,
              })
            }
          />

          <button
            type="button"
            onClick={saveDraft}
            disabled={saving}
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
        open={logoutSheet}
        onClose={() =>
          setLogoutSheet(false)
        }
        title="¿Cerrar sesión?"
      >
        <p className="text-[14px] text-[#6B6A66]">
          Vas a tener que volver a iniciar sesión para usar Wayco.
        </p>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={logout}
            className="wayco-btn wayco-btn-primary"
            style={{
              background: "var(--destructive)",
            }}
          >
            Sí, cerrar sesión
          </button>

          <button
            type="button"
            onClick={() =>
              setLogoutSheet(false)
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
        open={vehicleToDelete !== null}
        onClose={closeDeleteVehicle}
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
                  background: "var(--destructive)",
                }}
              >
                {delete_vehicle_mutation.isPending
                  ? "Eliminando…"
                  : "Sí, eliminar vehículo"}
              </button>

              <button
                type="button"
                onClick={closeDeleteVehicle}
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
        open={addVehSheet}
        mode={
          vehicleToUpdate
            ? "update_documents"
            : "create"
        }
        vehicle={vehicleToUpdate}
        onClose={() => {
          setAddVehSheet(false);
          setVehicleToUpdate(null);
        }}
        onCreated={() => {
          void vehicles_query.refetch();
        }}
        onUpdated={() => {
          setVehicleToUpdate(null);
          void vehicles_query.refetch();
        }}
      />
    </div>
  );
}