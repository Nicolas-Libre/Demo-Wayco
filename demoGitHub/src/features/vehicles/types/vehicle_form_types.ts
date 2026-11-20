export type VehicleFormState = {
  id: string;

  brand: string;

  model: string;

  year: number | "";

  version: string;

  licensePlate: string;

  // El combustible y el consumo se obtienen desde public.catalog
  // en el backend, no se envían desde este formulario.

  insuranceDocumentPath: string | null;

  insuranceDocumentName: string | null;

  driverLicenseDocumentPath: string | null;

  driverLicenseDocumentName: string | null;

  dniFrontDocumentPath: string | null;

  dniFrontDocumentName: string | null;

  dniBackDocumentPath: string | null;

  dniBackDocumentName: string | null;

  registrationCardDocumentPath: string | null;

  registrationCardDocumentName: string | null;
};
