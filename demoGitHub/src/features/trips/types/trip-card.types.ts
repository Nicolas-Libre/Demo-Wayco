export type TripBadgeTone = "success" | "warning" | "neutral";

export type TripCardData = {
  id: string;
  conductorNombre: string;
  conductorInicial?: string;
  conductorColor?: string;
  rating?: number | null;
  viajesConductor?: number;
  origen: string;
  destino: string;
  hora: string;
  duracionMin?: number;
  asientosDisponibles: number;
  asientosTotales: number;
  vehiculo?: string | null;
  precio: number;
  badge?: {
    label: string;
    tone: TripBadgeTone;
  };
};
