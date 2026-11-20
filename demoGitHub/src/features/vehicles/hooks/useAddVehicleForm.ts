import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  MyVehicle,
} from "@wayco/shared/vehicles";

import {
  designatedDriverSchema,
  isValidLicensePlate,
  normalizeLicensePlate,
} from "@wayco/shared/vehicles";

import {
  createDesignatedDriver,
  createVehicle,
  updateVehicleDocuments,
} from "../services/vehicles_api";

import {
  uploadDesignatedDriverDocument,
  uploadVehicleDocument,
} from "../services/vehicleDocuments_service";

import type {
  DesignatedDriverFormState,
} from "../components/DesignatedDriverForm";

import type {
  VehicleFormState,
} from "../types/vehicle_form_types";


/* =========================================================
 * MODE
 * ======================================================= */

export type AddVehicleFormMode =
  | "create"
  | "update_documents";


type UseAddVehicleFormParams = {
  mode?:
    AddVehicleFormMode;

  vehicle?:
    MyVehicle | null;
};


/* =========================================================
 * INITIAL STATE
 * ======================================================= */

function createInitialState():
  VehicleFormState {
  return {
    id:
      crypto.randomUUID(),

    brand:
      "",

    model:
      "",

    year:
      "",

    version:
      "",

    licensePlate:
      "",

    insuranceDocumentPath:
      null,

    insuranceDocumentName:
      null,

    driverLicenseDocumentPath:
      null,

    driverLicenseDocumentName:
      null,

    dniFrontDocumentPath:
      null,

    dniFrontDocumentName:
      null,

    dniBackDocumentPath:
      null,

    dniBackDocumentName:
      null,

    registrationCardDocumentPath:
      null,

    registrationCardDocumentName:
      null,
  };
}


function createVehicleUpdateState(
  vehicle:
    MyVehicle,
): VehicleFormState {
  return {
    id:
      vehicle.id,

    brand:
      vehicle.brand,

    model:
      vehicle.model,

    year:
      vehicle.year,

    version:
      vehicle.version ?? "",

    licensePlate:
      vehicle.licensePlate,

    insuranceDocumentPath:
      null,

    insuranceDocumentName:
      null,

    driverLicenseDocumentPath:
      null,

    driverLicenseDocumentName:
      null,

    dniFrontDocumentPath:
      null,

    dniFrontDocumentName:
      null,

    dniBackDocumentPath:
      null,

    dniBackDocumentName:
      null,

    registrationCardDocumentPath:
      null,

    registrationCardDocumentName:
      null,
  };
}


function createDesignatedDriverState():
  DesignatedDriverFormState {
  return {
    id:
      crypto.randomUUID(),

    name:
      "",

    surname:
      "",

    dni:
      "",

    dniFrontDocumentPath:
      null,

    dniFrontDocumentName:
      null,

    dniBackDocumentPath:
      null,

    dniBackDocumentName:
      null,

    driverLicenseDocumentPath:
      null,

    driverLicenseDocumentName:
      null,
  };
}


/* =========================================================
 * HOOK
 * ======================================================= */

export function useAddVehicleForm({
  mode = "create",
  vehicle = null,
}: UseAddVehicleFormParams = {}) {
  const buildInitialState =
    useCallback(
      (): VehicleFormState => {
        if (
          mode ===
            "update_documents" &&
          vehicle
        ) {
          return createVehicleUpdateState(
            vehicle,
          );
        }

        return createInitialState();
      },
      [
        mode,
        vehicle,
      ],
    );


  const initialStateRef =
    useRef<VehicleFormState>(
      buildInitialState(),
    );


  const [
    form,
    setForm,
  ] =
    useState<VehicleFormState>(
      initialStateRef.current,
    );


  const [
    designatedDrivers,
    setDesignatedDrivers,
  ] =
    useState<
      DesignatedDriverFormState[]
    >(
      [],
    );


  const [
    step,
    setStep,
  ] =
    useState<
      1 |
      2 |
      3
    >(
      mode ===
      "update_documents"
        ? 2
        : 1,
    );


  const [
    saving,
    setSaving,
  ] =
    useState(
      false,
    );


  const [
    confirmationVisible,
    setConfirmationVisible,
  ] =
    useState(
      false,
    );


  /* =======================================================
   * MODE / VEHICLE CHANGE
   * ===================================================== */

  useEffect(() => {
    if (
      confirmationVisible
    ) {
      return;
    }


    const newState =
      buildInitialState();


    initialStateRef.current =
      newState;


    setForm(
      newState,
    );


    setDesignatedDrivers(
      [],
    );


    setStep(
      mode ===
        "update_documents"
        ? 2
        : 1,
    );


    setSaving(
      false,
    );
  }, [
    buildInitialState,
    mode,
    confirmationVisible,
  ]);


  /* =======================================================
   * UPDATE VEHICLE FIELD
   * ===================================================== */

  const updateField =
    useCallback(
      <
        K extends keyof VehicleFormState,
      >(
        field:
          K,

        value:
          VehicleFormState[K],
      ) => {
        setForm((current) => {
          if (field === "brand") {
            return {
              ...current,
              brand: value as string,
              model: "",
              year: "",
              version: "",
            };
          }
          if (field === "model") {
            return {
              ...current,
              model: value as string,
              year: "",
              version: "",
            };
          }
          if (field === "year") {
            return {
              ...current,
              year: value as number | "",
              version: "",
            };
          }
          return { ...current, [field]: value };
        });
      },
      [],
    );


  /* =======================================================
   * DESIGNATED DRIVERS
   * ===================================================== */

  const addDesignatedDriver =
    useCallback(
      () => {
        setDesignatedDrivers(
          (
            current,
          ) => [
            ...current,
            createDesignatedDriverState(),
          ],
        );
      },
      [],
    );


  const updateDesignatedDriver =
    useCallback(
      (
        driverId:
          string,

        field:
          "name" |
          "surname" |
          "dni",

        value:
          string,
      ) => {
        setDesignatedDrivers(
          (
            current,
          ) =>
            current.map(
              (
                driver,
              ) =>
                driver.id ===
                driverId
                  ? {
                      ...driver,

                      [field]:
                        value,
                    }
                  : driver,
            ),
        );
      },
      [],
    );


  const removeDesignatedDriver =
    useCallback(
      (
        driverId:
          string,
      ) => {
        setDesignatedDrivers(
          (
            current,
          ) =>
            current.filter(
              (
                driver,
              ) =>
                driver.id !==
                driverId,
            ),
        );
      },
      [],
    );


  const updateDesignatedDriverState =
    useCallback(
      (
        driverId:
          string,

        changes:
          Partial<DesignatedDriverFormState>,
      ) => {
        setDesignatedDrivers(
          (
            current,
          ) =>
            current.map(
              (
                driver,
              ) =>
                driver.id ===
                driverId
                  ? {
                      ...driver,
                      ...changes,
                    }
                  : driver,
            ),
        );
      },
      [],
    );


  async function uploadDesignatedDriverDniFront(
    driverId:
      string,

    file:
      File,
  ): Promise<void> {
    const path =
      await uploadDesignatedDriverDocument({
        vehicleId:
          form.id,

        designatedDriverId:
          driverId,

        documentType:
          "dni-frente",

        file,
      });


    updateDesignatedDriverState(
      driverId,
      {
        dniFrontDocumentPath:
          path,

        dniFrontDocumentName:
          file.name,
      },
    );
  }


  async function uploadDesignatedDriverDniBack(
    driverId:
      string,

    file:
      File,
  ): Promise<void> {
    const path =
      await uploadDesignatedDriverDocument({
        vehicleId:
          form.id,

        designatedDriverId:
          driverId,

        documentType:
          "dni-dorso",

        file,
      });


    updateDesignatedDriverState(
      driverId,
      {
        dniBackDocumentPath:
          path,

        dniBackDocumentName:
          file.name,
      },
    );
  }


  async function uploadDesignatedDriverLicense(
    driverId:
      string,

    file:
      File,
  ): Promise<void> {
    const path =
      await uploadDesignatedDriverDocument({
        vehicleId:
          form.id,

        designatedDriverId:
          driverId,

        documentType:
          "licencia",

        file,
      });


    updateDesignatedDriverState(
      driverId,
      {
        driverLicenseDocumentPath:
          path,

        driverLicenseDocumentName:
          file.name,
      },
    );
  }


  /* =======================================================
   * VALIDATION
   * ===================================================== */

  const dataStepValid =
    useMemo(
      () => {
        const currentYear =
          new Date()
            .getFullYear();


        return (
          form.brand
            .trim()
            .length >
            0 &&

          form.model
            .trim()
            .length >
            0 &&

          typeof form.year ===
            "number" &&

          form.year >=
            2000 &&

          form.year <=
            currentYear &&

          form.version.trim().length > 0 &&

          isValidLicensePlate(
            form.licensePlate,
          )
        );
      },
      [
        form,
      ],
    );


  const designatedDriversValid =
    useMemo(
      () =>
        designatedDrivers.every(
          (
            driver,
          ) => {
            if (
              !driver.dniFrontDocumentPath ||
              !driver.dniBackDocumentPath ||
              !driver.driverLicenseDocumentPath
            ) {
              return false;
            }


            return designatedDriverSchema
              .safeParse({
                id:
                  driver.id,

                name:
                  driver.name,

                surname:
                  driver.surname,

                dni:
                  driver.dni,

                dniFrontDocumentPath:
                  driver.dniFrontDocumentPath,

                dniBackDocumentPath:
                  driver.dniBackDocumentPath,

                driverLicenseDocumentPath:
                  driver.driverLicenseDocumentPath,
              })
              .success;
          },
        ),
      [
        designatedDrivers,
      ],
    );


  const mainDocumentsValid =
    Boolean(
      form.insuranceDocumentPath,
    ) &&
    Boolean(
      form.driverLicenseDocumentPath,
    ) &&
    Boolean(
      form.dniFrontDocumentPath,
    ) &&
    Boolean(
      form.dniBackDocumentPath,
    ) &&
    Boolean(
      form.registrationCardDocumentPath,
    );


  const documentsStepValid =
    mainDocumentsValid &&
    (
      mode ===
        "update_documents" ||
      designatedDriversValid
    );


  /* =======================================================
   * MAIN DRIVER UPLOADS
   * ===================================================== */

  async function uploadInsurance(
    file:
      File,
  ): Promise<void> {
    const path =
      await uploadVehicleDocument({
        vehicleId:
          form.id,

        documentType:
          "seguro",

        file,
      });


    setForm(
      (
        current,
      ) => ({
        ...current,

        insuranceDocumentPath:
          path,

        insuranceDocumentName:
          file.name,
      }),
    );
  }


  async function uploadDriverLicense(
    file:
      File,
  ): Promise<void> {
    const path =
      await uploadVehicleDocument({
        vehicleId:
          form.id,

        documentType:
          "licencia",

        file,
      });


    setForm(
      (
        current,
      ) => ({
        ...current,

        driverLicenseDocumentPath:
          path,

        driverLicenseDocumentName:
          file.name,
      }),
    );
  }


  async function uploadDniFront(
    file:
      File,
  ): Promise<void> {
    const path =
      await uploadVehicleDocument({
        vehicleId:
          form.id,

        documentType:
          "dni-frente",

        file,
      });


    setForm(
      (
        current,
      ) => ({
        ...current,

        dniFrontDocumentPath:
          path,

        dniFrontDocumentName:
          file.name,
      }),
    );
  }


  async function uploadDniBack(
    file:
      File,
  ): Promise<void> {
    const path =
      await uploadVehicleDocument({
        vehicleId:
          form.id,

        documentType:
          "dni-dorso",

        file,
      });


    setForm(
      (
        current,
      ) => ({
        ...current,

        dniBackDocumentPath:
          path,

        dniBackDocumentName:
          file.name,
      }),
    );
  }


  async function uploadRegistrationCard(
    file:
      File,
  ): Promise<void> {
    const path =
      await uploadVehicleDocument({
        vehicleId:
          form.id,

        documentType:
          "cedula-verde",

        file,
      });


    setForm(
      (
        current,
      ) => ({
        ...current,

        registrationCardDocumentPath:
          path,

        registrationCardDocumentName:
          file.name,
      }),
    );
  }


  /* =======================================================
   * SUBMIT
   * ===================================================== */

  async function submit() {
    if (
      !form.insuranceDocumentPath ||
      !form.driverLicenseDocumentPath ||
      !form.dniFrontDocumentPath ||
      !form.dniBackDocumentPath ||
      !form.registrationCardDocumentPath
    ) {
      throw new Error(
        "Tenés que cargar el seguro, la licencia, el frente y dorso del DNI y la cédula verde.",
      );
    }


    if (
      mode ===
        "create" &&
      !designatedDriversValid
    ) {
      throw new Error(
        "Completá todos los datos y documentos de los conductores designados.",
      );
    }


    setSaving(
      true,
    );


    try {
      if (
        mode ===
          "update_documents"
      ) {
        if (
          !vehicle
        ) {
          throw new Error(
            "No se encontró el vehículo que querés actualizar.",
          );
        }


        const updatedVehicle =
          await updateVehicleDocuments(
            vehicle.id,
            {
              insuranceDocumentPath:
                form.insuranceDocumentPath,

              driverLicenseDocumentPath:
                form.driverLicenseDocumentPath,

              dniFrontDocumentPath:
                form.dniFrontDocumentPath,

              dniBackDocumentPath:
                form.dniBackDocumentPath,

              registrationCardDocumentPath:
                form.registrationCardDocumentPath,
            },
          );


        setConfirmationVisible(
          true,
        );


        return updatedVehicle;
      }


      if (
        typeof form.year !==
          "number" ||
        !form.version.trim() ||
        !dataStepValid
      ) {
        throw new Error(
          "Los datos del vehículo están incompletos.",
        );
      }


      const createdVehicle =
        await createVehicle({
          id:
            form.id,

          brand:
            form.brand.trim(),

          model:
            form.model.trim(),

          year:
            form.year,

          licensePlate:
            normalizeLicensePlate(
              form.licensePlate,
            ),

          version:
            form.version.trim(),

          insuranceDocumentPath:
            form.insuranceDocumentPath,

          driverLicenseDocumentPath:
            form.driverLicenseDocumentPath,

          dniFrontDocumentPath:
            form.dniFrontDocumentPath,

          dniBackDocumentPath:
            form.dniBackDocumentPath,

          registrationCardDocumentPath:
            form.registrationCardDocumentPath,
        });


      for (
        const driver
        of designatedDrivers
      ) {
        if (
          !driver.dniFrontDocumentPath ||
          !driver.dniBackDocumentPath ||
          !driver.driverLicenseDocumentPath
        ) {
          throw new Error(
            "La documentación de un conductor designado está incompleta.",
          );
        }


        await createDesignatedDriver(
          form.id,
          {
            id:
              driver.id,

            name:
              driver.name.trim(),

            surname:
              driver.surname.trim(),

            dni:
              driver.dni.trim(),

            dniFrontDocumentPath:
              driver.dniFrontDocumentPath,

            dniBackDocumentPath:
              driver.dniBackDocumentPath,

            driverLicenseDocumentPath:
              driver.driverLicenseDocumentPath,
          },
        );
      }


      setConfirmationVisible(
        true,
      );


      return createdVehicle;
    } finally {
      setSaving(
        false,
      );
    }
  }


  /* =======================================================
   * RESET
   * ===================================================== */

  const reset =
    useCallback(
      () => {
        const newState =
          buildInitialState();


        initialStateRef.current =
          newState;


        setForm(
          newState,
        );


        setDesignatedDrivers(
          [],
        );


        setStep(
          mode ===
            "update_documents"
            ? 2
            : 1,
        );


        setSaving(
          false,
        );


        setConfirmationVisible(
          false,
        );
      },
      [
        buildInitialState,
        mode,
      ],
    );


  /* =======================================================
   * RETURN
   * ===================================================== */

  return {
    form,
    designatedDrivers,

    step,
    saving,
    confirmationVisible,

    mode,

    dataStepValid,
    documentsStepValid,

    setStep,
    setConfirmationVisible,
    updateField,

    addDesignatedDriver,
    updateDesignatedDriver,
    removeDesignatedDriver,

    uploadDesignatedDriverDniFront,
    uploadDesignatedDriverDniBack,
    uploadDesignatedDriverLicense,

    clearDesignatedDriverDniFront(
      driverId:
        string,
    ) {
      updateDesignatedDriverState(
        driverId,
        {
          dniFrontDocumentPath:
            null,

          dniFrontDocumentName:
            null,
        },
      );
    },

    clearDesignatedDriverDniBack(
      driverId:
        string,
    ) {
      updateDesignatedDriverState(
        driverId,
        {
          dniBackDocumentPath:
            null,

          dniBackDocumentName:
            null,
        },
      );
    },

    clearDesignatedDriverLicense(
      driverId:
        string,
    ) {
      updateDesignatedDriverState(
        driverId,
        {
          driverLicenseDocumentPath:
            null,

          driverLicenseDocumentName:
            null,
        },
      );
    },

    uploadInsurance,
    uploadDriverLicense,
    uploadDniFront,
    uploadDniBack,
    uploadRegistrationCard,

    clearInsurance() {
      updateField(
        "insuranceDocumentPath",
        null,
      );

      updateField(
        "insuranceDocumentName",
        null,
      );
    },

    clearDriverLicense() {
      updateField(
        "driverLicenseDocumentPath",
        null,
      );

      updateField(
        "driverLicenseDocumentName",
        null,
      );
    },

    clearDniFront() {
      updateField(
        "dniFrontDocumentPath",
        null,
      );

      updateField(
        "dniFrontDocumentName",
        null,
      );
    },

    clearDniBack() {
      updateField(
        "dniBackDocumentPath",
        null,
      );

      updateField(
        "dniBackDocumentName",
        null,
      );
    },

    clearRegistrationCard() {
      updateField(
        "registrationCardDocumentPath",
        null,
      );

      updateField(
        "registrationCardDocumentName",
        null,
      );
    },

    submit,
    reset,
  };
}