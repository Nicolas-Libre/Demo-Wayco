
import {
  useState,
} from "react";

import {
  Check,
} from "lucide-react";

import {
  BottomSheet,
} from "@/components/overlays/BottomSheet";


type TermsAndConditionsProps = {
  accepted:
    boolean;

  onAcceptedChange:
    (
      accepted:
        boolean,
    ) => void;
};


export function TermsAndConditions({
  accepted,
  onAcceptedChange,
}: TermsAndConditionsProps) {
  const [
    showTerms,
    setShowTerms,
  ] =
    useState(
      false,
    );


  return (
    <>
      <div className="flex items-start gap-3 py-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={
            accepted
          }
          aria-label="Aceptar términos y condiciones"
          onClick={() =>
            onAcceptedChange(
              !accepted,
            )
          }
          className="mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
          style={{
            borderColor:
              accepted
                ? "var(--green-primary)"
                : "var(--border-color)",

            backgroundColor:
              accepted
                ? "var(--green-primary)"
                : "transparent",
          }}
        >
          {accepted && (
            <Check className="h-4 w-4 text-white" />
          )}
        </button>


        <div className="flex flex-col gap-1">
            <span className="text-[17px] font-semibold text-foreground">
                Términos y Condiciones
            </span>

            <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="w-fit text-left text-[12px] font-medium underline underline-offset-2"
                style={{
                    color: "var(--green-primary)",
                }}
            >
                Ver Términos y Condiciones
            </button>
        </div>
      </div>


      <BottomSheet
        open={
          showTerms
        }
        onClose={() =>
          setShowTerms(
            false,
          )
        }
        title="Términos y Condiciones"
      >
        <p className="text-[14px] leading-relaxed text-foreground">
          Aca van los terminos y condiciones Aca van los terminos y condiciones
          Aca van los terminos y condiciones Aca van los terminos y condiciones
          Aca van los terminos y condicioness Aca van los terminos y condiciones
         Aca van los terminos y condiciones Aca van los terminos y condiciones
          Aca van los terminos y condiciones
          Aca van los terminos y condiciones
          Aca van los terminos y condiciones
        </p>
      </BottomSheet>
    </>
  );
}
