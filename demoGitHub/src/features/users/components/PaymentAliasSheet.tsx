import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  CreditCard,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  BottomSheet,
} from "@/components/overlays/BottomSheet";

import {
  use_current_user,
} from "@/features/users/hooks/use_current_user";

import {
  use_update_current_user,
} from "@/features/users/hooks/use_update_current_user";


type PaymentAliasSheetProps = {
  open:
    boolean;

  onClose:
    () => void;

  onSaved?:
    () => void;
};


export function PaymentAliasSheet({
  open,
  onClose,
  onSaved,
}: PaymentAliasSheetProps) {
  const current_user_query =
    use_current_user();

  const update_user_mutation =
    use_update_current_user();


  const [
    alias,
    setAlias,
  ] =
    useState(
      "",
    );


  const normalizedAlias =
    alias.trim();

  const aliasValid =
    normalizedAlias.length >
    0;


  /* =======================================================
   * RESET
   * ===================================================== */

  useEffect(() => {
    if (open) {
      setAlias(
        current_user_query.data
          ?.cbuAlias ??
          "",
      );

      return;
    }


    const timeout =
      window.setTimeout(
        () => {
          setAlias(
            "",
          );
        },
        200,
      );


    return () =>
      window.clearTimeout(
        timeout,
      );
  }, [
    open,
    current_user_query.data
      ?.cbuAlias,
  ]);


  /* =======================================================
   * SAVE
   * ===================================================== */

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();


    if (
      !aliasValid ||
      update_user_mutation.isPending
    ) {
      return;
    }


    try {
      await update_user_mutation
        .mutateAsync({
          cbuAlias:
            normalizedAlias,
        });


      await current_user_query
        .refetch();


      toast.success(
        "Alias guardado",
      );


      onSaved?.();

      onClose();
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el alias.",
      );
    }
  }


  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <BottomSheet
      open={
        open
      }
      onClose={() => {
        if (
          update_user_mutation.isPending
        ) {
          return;
        }


        onClose();
      }}
      title="Cargar CBU / Alias"
    >
      <form
        onSubmit={
          handleSubmit
        }
      >
        <div
          className="flex items-start gap-3 rounded-[12px] p-4"
          style={{
            backgroundColor:
              "#F4FAF7",

            border:
              "1px solid #CDE8DF",
          }}
        >
          <CreditCard
            className="mt-0.5 size-5 shrink-0"
            style={{
              color:
                "#1D9E75",
            }}
          />

          <div>
            <p className="text-[14px] font-semibold text-[#111110]">
              Medio de cobro
            </p>

            <p className="mt-1 text-[12px] leading-[1.5] text-[#6B6A66]">
              Este CBU o alias será utilizado para que los pasajeros
              puedan realizarte transferencias.
            </p>
          </div>
        </div>


        <div className="mt-5">
          <label
            htmlFor="payment-alias"
            className="wayco-input-label"
          >
            CBU o alias
          </label>

          <input
            id="payment-alias"
            type="text"
            value={
              alias
            }
            onChange={(
              event,
            ) =>
              setAlias(
                event.target.value,
              )
            }
            disabled={
              update_user_mutation.isPending
            }
            autoComplete="off"
            placeholder="Ej: mi.alias"
            className="wayco-input mt-1"
          />

          <p className="mt-1.5 text-[11px] text-[#8A8984]">
            Ingresá el CBU o alias de la cuenta donde querés recibir los pagos.
          </p>
        </div>


        <div className="mt-6 space-y-2">
          <button
            type="submit"
            disabled={
              !aliasValid ||
              update_user_mutation.isPending
            }
            className="wayco-btn wayco-btn-primary disabled:opacity-40"
          >
            {update_user_mutation.isPending
              ? "Guardando…"
              : "Guardar alias"}
          </button>


          <button
            type="button"
            disabled={
              update_user_mutation.isPending
            }
            onClick={
              onClose
            }
            className="wayco-btn wayco-btn-secondary disabled:opacity-50"
          >
            Volver
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}