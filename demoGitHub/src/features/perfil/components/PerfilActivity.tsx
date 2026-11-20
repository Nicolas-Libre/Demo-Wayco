import {
  Clock,
  MessageSquare,
} from "lucide-react";

import {
  SectionHeader,
} from "@/components/layout/SectionHeader";

import {
  PerfilItem,
} from "./PerfilItem";

import {
  PerfilSectionGroup,
} from "./PerfilSectionGroup";

export function PerfilActivity() {
  return (
    <section className="px-5 pt-6">
      <SectionHeader>
        Actividad
      </SectionHeader>

      <PerfilSectionGroup>
        <PerfilItem
          icon={
            <MessageSquare className="h-5 w-5" />
          }
          title="Mensajes"
          to="/inbox"
        />

        <PerfilItem
          icon={
            <Clock className="h-5 w-5" />
          }
          title="Historial de viajes"
          to="/historial-viajes"
        />
      </PerfilSectionGroup>
    </section>
  );
}