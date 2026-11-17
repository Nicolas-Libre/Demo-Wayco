
import { useEffect, useState } from "react";

import {
  BottomSheet,
} from "@/components/overlays/BottomSheet";

export type AdminVehicleDecisionType =
  | "reject"
  | "disable";

type AdminVehicleDecisionSheetProps = {
  open: boolean;
  type: AdminVehicleDecisionType;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

const DECISION_CONTENT = {
  reject: {
    title: "Rechazar vehículo",
    description:
      "Seleccioná el motivo por el que la documentación o los datos del vehículo no pueden ser aprobados.",
    button: "Rechazar solicitud",
  },
  disable: {
    title: "Dar vehículo de baja",
    description:
      "Seleccioná el motivo por el que el vehículo dejará de estar habilitado para publicar viajes.",
    button: "Dar de baja",
  },
} as const;

const REASON_GROUPS = [
  {
    title: "Documentación del conductor",
    reasons: [
      "DNI vencido",
      "DNI ilegible o incompleto",
      "Licencia de conducir vencida",
      "Licencia de conducir ilegible o incompleta",
      "Licencia de conducir no correspondiente al titular",
      "Licencia de conducir no habilitada para el vehículo",
    ],
  },
  {
    title: "Documentación del vehículo",
    reasons: [
      "Cédula del vehículo vencida",
      "Cédula del vehículo ilegible o incompleta",
      "Documentación del vehículo no correspondiente al titular",
      "Patente no coincidente con la documentación",
    ],
  },
  {
    title: "Datos y requisitos del vehículo",
    reasons: [
      "Datos del vehículo incorrectos",
      "Datos inconsistentes con la documentación",
      "Vehículo que no cumple los requisitos de Wayco",
      "Documentación presuntamente adulterada",
    ],
  },
] as const;

const OTHER_REASON = "Otro motivo";

export function AdminVehicleDecisionSheet({
  open,
  type,
  loading = false,
  onClose,
  onConfirm,
}: AdminVehicleDecisionSheetProps) {
  const [selectedReason, setSelectedReason] =
    useState("");

  const [customReason, setCustomReason] =
    useState("");

  const content = DECISION_CONTENT[type];

  const isOtherReason =
    selectedReason === OTHER_REASON;

  const normalizedReason = isOtherReason
    ? customReason.trim()
    : selectedReason;

  const valid =
    normalizedReason.length >= 3 &&
    normalizedReason.length <= 500;

  useEffect(() => {
    if (!open) {
      setSelectedReason("");
      setCustomReason("");
    }
  }, [open]);

  function handleConfirm() {
    if (!valid || loading) {
      return;
    }

    onConfirm(normalizedReason);
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={content.title}
      tall
    >
      <p className="text-[13px] leading-[1.55] text-[#6B6A66]">
        {content.description}
      </p>

      <div className="mt-5 space-y-5">
        {REASON_GROUPS.map((group) => (
          <fieldset key={group.title}>
            <legend className="mb-2 text-[13px] font-semibold text-[#111110]">
              {group.title}
            </legend>

            <div className="space-y-2">
              {group.reasons.map((reason) => {
                const selected =
                  selectedReason === reason;

                return (
                  <label
                    key={reason}
                    className={`flex cursor-pointer items-start gap-3 rounded-[12px] border p-3 transition ${
                      selected
                        ? "border-[#1D9E75] bg-[#E8F5F0]"
                        : "border-[#E2E0D8] bg-white hover:border-[#B8B6AF]"
                    } ${
                      loading
                        ? "cursor-not-allowed opacity-60"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="admin-vehicle-reason"
                      value={reason}
                      checked={selected}
                      onChange={() =>
                        setSelectedReason(reason)
                      }
                      disabled={loading}
                      className="mt-0.5 accent-[#1D9E75]"
                    />

                    <span className="text-[13px] leading-[1.45] text-[#111110]">
                      {reason}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <fieldset>
          <legend className="mb-2 text-[13px] font-semibold text-[#111110]">
            Otros
          </legend>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-[12px] border p-3 transition ${
              isOtherReason
                ? "border-[#1D9E75] bg-[#E8F5F0]"
                : "border-[#E2E0D8] bg-white hover:border-[#B8B6AF]"
            }`}
          >
            <input
              type="radio"
              name="admin-vehicle-reason"
              value={OTHER_REASON}
              checked={isOtherReason}
              onChange={() =>
                setSelectedReason(OTHER_REASON)
              }
              disabled={loading}
              className="mt-0.5 accent-[#1D9E75]"
            />

            <span className="text-[13px] font-medium text-[#111110]">
              Otro motivo
            </span>
          </label>

          {isOtherReason && (
            <div className="mt-3">
              <label
                htmlFor="admin-vehicle-custom-reason"
                className="mb-2 block text-[12px] font-medium text-[#111110]"
              >
                Especificá el motivo
              </label>

              <textarea
                id="admin-vehicle-custom-reason"
                value={customReason}
                onChange={(event) =>
                  setCustomReason(event.target.value)
                }
                maxLength={500}
                rows={4}
                disabled={loading}
                placeholder="Escribí el motivo..."
                className="w-full resize-none rounded-[14px] border border-[#D8D7D2] bg-white px-4 py-3 text-[13px] text-[#111110] outline-none transition focus:border-[#111110] disabled:opacity-60"
              />

              <div className="mt-1 flex justify-between">
                <p className="text-[11px] text-[#8A8984]">
                  Mínimo 3 caracteres
                </p>

                <p className="text-[11px] text-[#8A8984]">
                  {customReason.length}/500
                </p>
              </div>
            </div>
          )}
        </fieldset>
      </div>

      <div className="mt-6 space-y-2">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!valid || loading}
          className="wayco-btn bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-red-600"
        >
          {loading
            ? "Procesando…"
            : content.button}
        </button>

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="wayco-btn wayco-btn-secondary disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </BottomSheet>
  );
}
