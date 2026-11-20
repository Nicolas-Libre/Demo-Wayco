import {
  useMemo,
  useState,
} from "react";

import type {
  AdminVehicle,
} from "@wayco/shared/admin";

import {
  Check,
} from "lucide-react";

import {
  VehicleValidationBadge,
} from "@/features/vehicles/components/VehicleValidationBadge";

import {
  formatDecimal,
} from "@/features/trips/utils/trip-formatters";

type AdminVehicleDetailsProps = {
  vehicle: AdminVehicle;

  approving?: boolean;

  onApprove: () => void;

  onReject: () => void;

  onDisable: () => void;
};

export function AdminVehicleDetails({
  vehicle,
  approving = false,
  onApprove,
  onReject,
  onDisable,
}: AdminVehicleDetailsProps) {
  const isPending =
    vehicle.validationState ===
    "pendiente";

  const isApproved =
    vehicle.validationState ===
    "aprobado";

  const [
    reviewedDocuments,
    setReviewedDocuments,
  ] = useState<Set<string>>(
    () => new Set(),
  );

  const requiredDocumentIds =
    useMemo(
      () => {
        const documentIds = [
          "insurance",
          "owner-license",
          "owner-dni-front",
          "owner-dni-back",
          "registration-card",
        ];

        for (
          const designatedDriver
          of vehicle.designatedDrivers
        ) {
          documentIds.push(
            `designated-${designatedDriver.id}-dni-front`,
            `designated-${designatedDriver.id}-dni-back`,
            `designated-${designatedDriver.id}-license`,
          );
        }

        return documentIds;
      },
      [
        vehicle.designatedDrivers,
      ],
    );

  const documentsReviewed =
    requiredDocumentIds.every(
      (documentId) =>
        reviewedDocuments.has(
          documentId,
        ),
    );

  const requiredDocumentsAvailable =
    Boolean(
      vehicle.secureUrl &&
      vehicle.licenseUrl &&
      vehicle.registrationCardUrl &&
      vehicle.driver?.dniFrontUrl &&
      vehicle.driver?.dniBackUrl &&
      vehicle.designatedDrivers.every(
        (designatedDriver) =>
          Boolean(
            designatedDriver.dniFrontUrl &&
            designatedDriver.dniBackUrl &&
            designatedDriver.licenseUrl,
          ),
      ),
    );

  const decisionDisabled =
    approving ||
    !documentsReviewed ||
    !requiredDocumentsAvailable;

  function markDocumentAsReviewed(
    documentId: string,
  ) {
    setReviewedDocuments(
      (current) => {
        const next = new Set(
          current,
        );

        next.add(
          documentId,
        );

        return next;
      },
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[20px] border border-[#E5E4DF] bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-bold text-[#111110]">
              {vehicle.brand}{" "}
              {vehicle.model}
            </h2>

            <p className="mt-1 text-[13px] text-[#6B6A66]">
              {vehicle.year} ·{" "}
              {vehicle.patent}
            </p>
          </div>

          <VehicleValidationBadge
            status={
              vehicle.validationState
            }
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <InformationItem
            label="Combustible"
            value={
              vehicle.fuel
            }
          />

          <InformationItem
            label="Consumo"
            value={`${formatDecimal(
              vehicle.fuelConsumptionX100km,
            )} L/100 km`}
          />
        </div>
      </section>

      <section className="rounded-[20px] border border-[#E5E4DF] bg-white p-5">
        <h3 className="text-[15px] font-bold text-[#111110]">
          Propietario
        </h3>

        <div className="mt-4 space-y-3">
          <InformationItem
            label="Nombre"
            value={
              vehicle.driver
                ? `${vehicle.driver.name} ${vehicle.driver.surname}`
                : "No disponible"
            }
          />

          <InformationItem
            label="Email"
            value={
              vehicle.driver?.email ??
              "No disponible"
            }
          />

          <InformationItem
            label="Teléfono"
            value={
              vehicle.driver?.phone ??
              "No informado"
            }
          />
        </div>
      </section>

      <section className="rounded-[20px] border border-[#E5E4DF] bg-white p-5">
        <h3 className="text-[15px] font-bold text-[#111110]">
          Documentación
        </h3>

        <p className="mt-1 text-[12px] leading-[1.5] text-[#6B6A66]">
          Revisá todos los documentos antes de tomar una decisión.
        </p>

        <div className="mt-4 space-y-2">
          <DocumentLink
            label="Seguro del vehículo"
            actionLabel="Ver seguro"
            url={
              vehicle.secureUrl
            }
            reviewed={
              reviewedDocuments.has(
                "insurance",
              )
            }
            onOpen={() =>
              markDocumentAsReviewed(
                "insurance",
              )
            }
          />

          <DocumentLink
            label="Licencia de conducir"
            actionLabel="Ver licencia"
            url={
              vehicle.licenseUrl
            }
            reviewed={
              reviewedDocuments.has(
                "owner-license",
              )
            }
            onOpen={() =>
              markDocumentAsReviewed(
                "owner-license",
              )
            }
          />

          <DocumentLink
            label="DNI frente"
            actionLabel="Ver DNI frente"
            url={
              vehicle.driver?.dniFrontUrl ??
              null
            }
            reviewed={
              reviewedDocuments.has(
                "owner-dni-front",
              )
            }
            onOpen={() =>
              markDocumentAsReviewed(
                "owner-dni-front",
              )
            }
          />

          <DocumentLink
            label="DNI dorso"
            actionLabel="Ver DNI dorso"
            url={
              vehicle.driver?.dniBackUrl ??
              null
            }
            reviewed={
              reviewedDocuments.has(
                "owner-dni-back",
              )
            }
            onOpen={() =>
              markDocumentAsReviewed(
                "owner-dni-back",
              )
            }
          />

          <DocumentLink
            label="Cédula verde"
            actionLabel="Ver cédula verde"
            url={
              vehicle.registrationCardUrl
            }
            reviewed={
              reviewedDocuments.has(
                "registration-card",
              )
            }
            onOpen={() =>
              markDocumentAsReviewed(
                "registration-card",
              )
            }
          />
        </div>

        {vehicle.designatedDrivers.length >
          0 && (
          <div className="mt-6 space-y-4">
            <div>
              <h4 className="text-[14px] font-bold text-[#111110]">
                Conductores designados
              </h4>

              <p className="mt-1 text-[12px] leading-[1.5] text-[#6B6A66]">
                También debés revisar toda la documentación de los conductores designados.
              </p>
            </div>

            {vehicle.designatedDrivers.map(
              (
                designatedDriver,
                index,
              ) => {
                const dniFrontId =
                  `designated-${designatedDriver.id}-dni-front`;

                const dniBackId =
                  `designated-${designatedDriver.id}-dni-back`;

                const licenseId =
                  `designated-${designatedDriver.id}-license`;

                return (
                  <div
                    key={
                      designatedDriver.id
                    }
                    className="rounded-[16px] border border-[#E5E4DF] p-4"
                  >
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8A8984]">
                        Conductor designado{" "}
                        {index + 1}
                      </p>

                      <h5 className="mt-1 text-[14px] font-bold text-[#111110]">
                        {designatedDriver.name}{" "}
                        {designatedDriver.surname}
                      </h5>

                      <p className="mt-1 text-[12px] text-[#6B6A66]">
                        DNI:{" "}
                        {designatedDriver.dni}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <DocumentLink
                        label="DNI frente"
                        actionLabel="Ver DNI frente"
                        url={
                          designatedDriver.dniFrontUrl
                        }
                        reviewed={
                          reviewedDocuments.has(
                            dniFrontId,
                          )
                        }
                        onOpen={() =>
                          markDocumentAsReviewed(
                            dniFrontId,
                          )
                        }
                      />

                      <DocumentLink
                        label="DNI dorso"
                        actionLabel="Ver DNI dorso"
                        url={
                          designatedDriver.dniBackUrl
                        }
                        reviewed={
                          reviewedDocuments.has(
                            dniBackId,
                          )
                        }
                        onOpen={() =>
                          markDocumentAsReviewed(
                            dniBackId,
                          )
                        }
                      />

                      <DocumentLink
                        label="Licencia de conducir"
                        actionLabel="Ver licencia"
                        url={
                          designatedDriver.licenseUrl
                        }
                        reviewed={
                          reviewedDocuments.has(
                            licenseId,
                          )
                        }
                        onOpen={() =>
                          markDocumentAsReviewed(
                            licenseId,
                          )
                        }
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}

        {!requiredDocumentsAvailable && (
          <p className="mt-4 rounded-[12px] bg-red-50 px-3 py-2 text-[11px] font-medium text-red-700">
            Falta documentación obligatoria. No se puede tomar una decisión sobre este vehículo.
          </p>
        )}

        {requiredDocumentsAvailable &&
          !documentsReviewed && (
          <p className="mt-3 text-[11px] font-medium text-[#8A8984]">
            {isPending
              ? "Debés abrir todos los documentos antes de aprobar o rechazar la solicitud."
              : "Debés abrir todos los documentos antes de dar de baja el vehículo."}
          </p>
        )}
      </section>

      {vehicle.rejectReason && (
        <section className="rounded-[20px] border border-red-200 bg-red-50 p-5">
          <h3 className="text-[15px] font-bold text-red-800">
            Motivo del rechazo
          </h3>

          <p className="mt-2 text-[13px] leading-[1.55] text-red-700">
            {vehicle.rejectReason}
          </p>
        </section>
      )}

      {vehicle.disableReason && (
        <section className="rounded-[20px] border border-[#E5E4DF] bg-[#F7F6F2] p-5">
          <h3 className="text-[15px] font-bold text-[#111110]">
            Motivo de baja
          </h3>

          <p className="mt-2 text-[13px] leading-[1.55] text-[#6B6A66]">
            {vehicle.disableReason}
          </p>
        </section>
      )}

      {isPending && (
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={
              onApprove
            }
            disabled={
              decisionDisabled
            }
            className="
              wayco-btn
              wayco-btn-primary
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {approving
              ? "Aprobando…"
              : "Aprobar vehículo"}
          </button>

          <button
            type="button"
            onClick={
              onReject
            }
            disabled={
              decisionDisabled
            }
            className="
              wayco-btn
              bg-red-600
              text-white
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-40
              disabled:hover:bg-red-600
            "
          >
            Rechazar vehículo
          </button>
        </div>
      )}

      {isApproved && (
        <div className="pt-2">
          <button
            type="button"
            onClick={
              onDisable
            }
            disabled={
              decisionDisabled
            }
            className="
              wayco-btn
              bg-red-600
              text-white
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-40
              disabled:hover:bg-red-600
            "
          >
            Dar vehículo de baja
          </button>
        </div>
      )}
    </div>
  );
}

function InformationItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium text-[#8A8984]">
        {label}
      </p>

      <p className="mt-0.5 break-words text-[14px] font-medium text-[#111110]">
        {value}
      </p>
    </div>
  );
}

function DocumentLink({
  label,
  actionLabel,
  url,
  reviewed,
  onOpen,
}: {
  label: string;
  actionLabel: string;
  url: string | null;
  reviewed: boolean;
  onOpen: () => void;
}) {
  if (!url) {
    return (
      <div className="flex items-center justify-between rounded-[14px] bg-[#F7F6F2] px-4 py-3">
        <span className="text-[13px] font-medium text-[#6B6A66]">
          {label}
        </span>

        <span className="text-[11px] text-red-600">
          No disponible
        </span>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={onOpen}
      className="
        flex
        items-center
        justify-between
        gap-3
        rounded-[14px]
        bg-[#F7F6F2]
        px-4
        py-3
        transition-colors
        hover:bg-[#EFEEE9]
      "
    >
      <span className="text-[13px] font-semibold text-[#111110]">
        {label}
      </span>

      {reviewed ? (
        <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[var(--primary-color)]">
          <Check className="h-4 w-4" />

          Revisado
        </span>
      ) : (
        <span className="shrink-0 text-[12px] font-semibold text-[var(--primary-color)]">
          {actionLabel}
        </span>
      )}
    </a>
  );
}