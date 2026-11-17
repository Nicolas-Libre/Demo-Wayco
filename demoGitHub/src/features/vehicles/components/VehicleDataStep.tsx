import type { VehicleFormState } from "../types/vehicle_form_types";
import { VEHICLE_FUEL_TYPES } from "@wayco/shared/vehicles";

type Props = {
  form: VehicleFormState;
  updateField: <K extends keyof VehicleFormState>(
    field: K,
    value: VehicleFormState[K],
  ) => void;
};

export function VehicleDataStep({
  form,
  updateField,
}: Props) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6A66]">
        Datos del vehículo
      </p>

      <Field label="Marca *">
        <input
          className="wayco-input"
          placeholder="Toyota, Volkswagen, Fiat..."
          value={form.brand}
          onChange={(event) =>
            updateField("brand", event.target.value)
          }
        />
      </Field>

      <Field label="Modelo *">
        <input
          className="wayco-input"
          placeholder="Corolla, Virtus, Cronos..."
          value={form.model}
          onChange={(event) =>
            updateField("model", event.target.value)
          }
        />
      </Field>

      <div className="flex gap-3">
        <div className="w-[45%]">
          <Field label="Año *">
            <input
              className="wayco-input"
              type="number"
              min={2000}
              max={new Date().getFullYear()}
              value={form.year}
              onChange={(event) =>
                updateField(
                  "year",
                  event.target.value === ""
                    ? ""
                    : Number.parseInt(event.target.value, 10),
                )
              }
            />
          </Field>
        </div>

        <div className="ml-auto w-[45%]">
          <Field label="Dominio *">
            <input
              className="wayco-input uppercase"
              placeholder="AB 123 CD"
              value={form.licensePlate}
              onChange={(event) =>
                updateField(
                  "licensePlate",
                  event.target.value.toUpperCase(),
                )
              }
            />
          </Field>
        </div>
      </div>

      <div>
        <span className="wayco-input-label">
          Combustible *
        </span>

        <div className="mt-1 grid grid-cols-3 gap-2">
          {VEHICLE_FUEL_TYPES.map((fuelType) => (
            <button
              key={fuelType}
              type="button"
              onClick={() =>
                updateField("fuelType", fuelType)
              }
              className="h-11 rounded-[10px] text-[13px] font-medium"
              style={{
                background:
                  fuelType === form.fuelType
                    ? "#1D9E75"
                    : "#F2F1ED",
                color:
                  fuelType === form.fuelType
                    ? "white"
                    : "#6B6A66",
              }}
            >
              {fuelType}
            </button>
          ))}
        </div>
      </div>

      <Field label="Consumo estimado *">
        <input
          className="wayco-input"
          type="number"
          min={3}
          max={25}
          step={0.1}
          value={form.consumptionL100Km}
          onChange={(event) =>
            updateField(
              "consumptionL100Km",
              event.target.value === ""
                ? ""
                : Number.parseFloat(event.target.value),
            )
          }
        />

        <p className="mt-1 text-[11px] text-[#9B9A96]">
          En litros cada 100 km. Se utiliza para calcular el
          precio del viaje.
        </p>
      </Field>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="wayco-input-label">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
