import { useEffect, useMemo, useState } from "react";
import type { VehicleFormState } from "../types/vehicle_form_types";

import {
  getCatalogBrands,
  getCatalogModels,
  getCatalogYears,
  getCatalogVersions,
} from "../services/vehicles_api";

type Props = {
  form: VehicleFormState;
  updateField: <K extends keyof VehicleFormState>(
    field: K,
    value: VehicleFormState[K],
  ) => void;
};

/**
 * Normaliza un texto para realizar comparaciones.
 *
 * Ejemplos:
 * Toyota -> toyota
 * TOYOTA -> toyota
 * toYOTa -> toyota
 */
const normalize = (value: string): string =>
  value.trim().toLocaleLowerCase("es");

/**
 * Normaliza la presentación de marcas y modelos.
 *
 * Ejemplos:
 * TOYOTA -> Toyota
 * toYOTa -> Toyota
 * MERCEDES BENZ -> Mercedes Benz
 *
 * Las denominaciones comerciales con siglas
 * especiales se podrán contemplar posteriormente.
 */
const toTitleCase = (value: string): string =>
  value
    .trim()
    .toLocaleLowerCase("es")
    .replace(
      /(^|[\s-])(\p{L})/gu,
      (_, separator: string, letter: string) =>
        separator + letter.toLocaleUpperCase("es"),
    );

/**
 * Elimina duplicados sin distinguir mayúsculas.
 *
 * Ejemplo:
 * ["Toyota", "TOYOTA", "toYOTa"]
 * ->
 * ["Toyota"]
 */
function normalizeCatalogOptions(
  values: string[],
): string[] {
  const unique = new Map<string, string>();

  for (const value of values) {
    const normalized = normalize(value);

    if (!normalized) {
      continue;
    }

    if (!unique.has(normalized)) {
      unique.set(
        normalized,
        toTitleCase(value),
      );
    }
  }

  return [...unique.values()].sort((a, b) =>
    a.localeCompare(b, "es", {
      sensitivity: "base",
    }),
  );
}

/**
 * Elimina versiones duplicadas sin modificar
 * su denominación comercial.
 *
 * Las versiones pueden contener siglas, números
 * y abreviaturas que deben conservarse.
 */
function normalizeVersionOptions(
  values: string[],
): string[] {
  const unique = new Map<string, string>();

  for (const value of values) {
    const normalized = normalize(value);

    if (!normalized) {
      continue;
    }

    if (!unique.has(normalized)) {
      unique.set(
        normalized,
        value.trim(),
      );
    }
  }

  return [...unique.values()].sort((a, b) =>
    a.localeCompare(b, "es", {
      sensitivity: "base",
    }),
  );
}

export function VehicleDataStep({
  form,
  updateField,
}: Props) {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [versions, setVersions] = useState<string[]>([]);

  const [brandsLoading, setBrandsLoading] =
    useState(false);

  const [modelsLoading, setModelsLoading] =
    useState(false);

  const [yearsLoading, setYearsLoading] =
    useState(false);

  const [versionsLoading, setVersionsLoading] =
    useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  /**
   * Cargar marcas del catálogo.
   */
  useEffect(() => {
    let active = true;

    setBrandsLoading(true);

    getCatalogBrands()
      .then((values) => {
        if (!active) {
          return;
        }

        setBrands(
          normalizeCatalogOptions(values),
        );

        setError(null);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setError(
          "No se pudieron cargar las marcas del catálogo. Podés escribirlas manualmente.",
        );
      })
      .finally(() => {
        if (active) {
          setBrandsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  /**
   * Reconocer una marca existente sin distinguir
   * mayúsculas y minúsculas.
   *
   * Ejemplo:
   * form.brand = "toYOTa"
   * selectedBrand = "Toyota"
   */
  const selectedBrand = useMemo(
    () =>
      brands.find(
        (brand) =>
          normalize(brand) === normalize(form.brand),
      ),
    [brands, form.brand],
  );

  /**
   * Cargar modelos de la marca reconocida.
   */
  useEffect(() => {
    let active = true;

    setModels([]);
    setModelsLoading(false);

    if (!selectedBrand) {
      return () => {
        active = false;
      };
    }

    setModelsLoading(true);

    getCatalogModels(selectedBrand)
      .then((values) => {
        if (!active) {
          return;
        }

        setModels(
          normalizeCatalogOptions(values),
        );

        setError(null);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setError(
          "No se pudieron cargar los modelos. Podés escribir el modelo manualmente.",
        );
      })
      .finally(() => {
        if (active) {
          setModelsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedBrand]);

  /**
   * Reconocer un modelo existente sin distinguir
   * mayúsculas y minúsculas.
   */
  const selectedModel = useMemo(
    () =>
      models.find(
        (model) =>
          normalize(model) === normalize(form.model),
      ),
    [models, form.model],
  );

  /**
   * Cargar años del modelo reconocido.
   */
  useEffect(() => {
    let active = true;

    setYears([]);
    setYearsLoading(false);

    if (!selectedBrand || !selectedModel) {
      return () => {
        active = false;
      };
    }

    setYearsLoading(true);

    getCatalogYears(
      selectedBrand,
      selectedModel,
    )
      .then((values) => {
        if (!active) {
          return;
        }

        setYears(
          [...new Set(values)].sort(
            (a, b) => b - a,
          ),
        );

        setError(null);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setError(
          "No se pudieron cargar los años. Podés escribir el año manualmente.",
        );
      })
      .finally(() => {
        if (active) {
          setYearsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedBrand, selectedModel]);

  /**
   * Cargar versiones para la combinación
   * marca + modelo + año.
   */
  useEffect(() => {
    let active = true;

    setVersions([]);
    setVersionsLoading(false);

    if (
      !selectedBrand ||
      !selectedModel ||
      typeof form.year !== "number" ||
      !years.includes(form.year)
    ) {
      return () => {
        active = false;
      };
    }

    setVersionsLoading(true);

    getCatalogVersions(
      selectedBrand,
      selectedModel,
      form.year,
    )
      .then((values) => {
        if (!active) {
          return;
        }

        setVersions(
          normalizeVersionOptions(values),
        );

        setError(null);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setError(
          "No se pudieron cargar las versiones. Podés escribir la versión manualmente.",
        );
      })
      .finally(() => {
        if (active) {
          setVersionsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [
    selectedBrand,
    selectedModel,
    form.year,
    years,
  ]);

  /**
   * Sugerir marcas únicamente cuando
   * el usuario escribió al menos una letra.
   */
  const suggestedBrands = useMemo(() => {
    const search = normalize(form.brand);

    if (!search) {
      return [];
    }

    return brands.filter((brand) =>
      normalize(brand).startsWith(search),
    );
  }, [brands, form.brand]);

  /**
   * Sugerir modelos únicamente cuando
   * el usuario escribió al menos una letra.
   */
  const suggestedModels = useMemo(() => {
    const search = normalize(form.model);

    if (!search || !selectedBrand) {
      return [];
    }

    return models.filter((model) =>
      normalize(model).startsWith(search),
    );
  }, [
    models,
    form.model,
    selectedBrand,
  ]);

  /**
   * Las versiones se muestran al acceder
   * al campo, incluso cuando está vacío.
   */
  const suggestedVersions = useMemo(() => {
    const search = normalize(form.version);

    if (!search) {
      return versions;
    }

    return versions.filter((version) =>
      normalize(version).startsWith(search),
    );
  }, [
    versions,
    form.version,
  ]);

  const loading =
    brandsLoading ||
    modelsLoading ||
    yearsLoading ||
    versionsLoading;

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6A66]">
        Datos del vehículo
      </p>

      <Field label="Marca *">
        <input
          className="wayco-input"
          list={
            normalize(form.brand).length > 0
              ? "wayco-catalog-brands"
              : undefined
          }
          autoComplete="off"
          placeholder="Empezá a escribir una marca"
          value={form.brand}
          onChange={(event) =>
            updateField(
              "brand",
              event.target.value,
            )
          }
        />

        {normalize(form.brand).length > 0 && (
          <datalist id="wayco-catalog-brands">
            {suggestedBrands.map((value) => (
              <option
                key={normalize(value)}
                value={value}
              />
            ))}
          </datalist>
        )}
      </Field>

      <Field label="Modelo *">
        <input
          className="wayco-input"
          list={
            normalize(form.model).length > 0
              ? "wayco-catalog-models"
              : undefined
          }
          autoComplete="off"
          placeholder={
            form.brand.trim()
              ? "Elegí o escribí un modelo"
              : "Primero escribí una marca"
          }
          disabled={!form.brand.trim()}
          value={form.model}
          onChange={(event) =>
            updateField(
              "model",
              event.target.value,
            )
          }
        />

        {normalize(form.model).length > 0 && (
          <datalist id="wayco-catalog-models">
            {suggestedModels.map((value) => (
              <option
                key={normalize(value)}
                value={value}
              />
            ))}
          </datalist>
        )}
      </Field>

      <div className="flex gap-3">
        <div className="w-[45%]">
          <Field label="Año *">
            <input
              className="wayco-input"
              type="number"
              inputMode="numeric"
              min={2000}
              max={currentYear}
              step={1}
              list="wayco-catalog-years"
              placeholder="Ej. 2022"
              disabled={!form.model.trim()}
              value={form.year}
              onChange={(event) => {
                const value = event.target.value;

                updateField(
                  "year",
                  value === ""
                    ? ""
                    : Number(value),
                );
              }}
            />

            <datalist id="wayco-catalog-years">
              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                />
              ))}
            </datalist>
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

      <Field label="Versión *">
        <input
          className="wayco-input"
          list="wayco-catalog-versions"
          autoComplete="off"
          placeholder={
            typeof form.year === "number"
              ? "Elegí o escribí una versión"
              : "Primero indicá el año"
          }
          disabled={
            typeof form.year !== "number"
          }
          value={form.version}
          onChange={(event) =>
            updateField(
              "version",
              event.target.value,
            )
          }
        />

        <datalist id="wayco-catalog-versions">
          {suggestedVersions.map((value) => (
            <option
              key={normalize(value)}
              value={value}
            />
          ))}
        </datalist>
      </Field>

      {loading && (
        <p className="text-[11px] text-[#6B6A66]">
          Cargando sugerencias del catálogo...
        </p>
      )}

      {error && (
        <p
          role="status"
          className="text-[12px] text-[#6B6A66]"
        >
          {error}
        </p>
      )}

      <p className="text-[11px] text-[#9B9A96]">
        Si tu vehículo no aparece en las sugerencias,
        podés completar sus datos manualmente.
        El combustible y el consumo se determinan
        automáticamente por el sistema para calcular
        el precio del viaje.
      </p>
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
      <span className="wayco-input-label">
        {label}
      </span>

      <div className="mt-1">
        {children}
      </div>
    </label>
  );
}