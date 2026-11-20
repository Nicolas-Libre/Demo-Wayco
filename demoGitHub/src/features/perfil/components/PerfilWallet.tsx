import {
  Building2,
  CreditCard,
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

type PerfilWalletProps = {
  cbuAlias: string;
  onEditCbu: () => void;
};

export function PerfilWallet({
  cbuAlias,
  onEditCbu,
}: PerfilWalletProps) {
  return (
    <section className="px-5 pt-7">
      <SectionHeader>
        Billetera
      </SectionHeader>

      <PerfilSectionGroup>
        <PerfilItem
          icon={
            <CreditCard className="h-5 w-5" />
          }
          title="CBU / Alias"
          subtitle={
            cbuAlias ||
            "Sin alias cargado"
          }
          onClick={onEditCbu}
          primary
        />

        <PerfilItem
          icon={
            <Building2 className="h-5 w-5" />
          }
          title="Método de pago"
          subtitle="Transferencia bancaria"
        />
      </PerfilSectionGroup>
    </section>
  );
}