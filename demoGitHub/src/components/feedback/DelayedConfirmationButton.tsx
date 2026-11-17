import {
  useEffect,
  useState,
} from "react";


const CONFIRMATION_DELAY_MS =
  10_000;


type DelayedConfirmationButtonProps = {
  onConfirm:
    () => void;

  label?:
    string;

  waitingLabel?:
    string;

  className?:
    string;
};


export function DelayedConfirmationButton({
  onConfirm,
  label = "Entendido",
  waitingLabel = "Entendido",
  className = "",
}: DelayedConfirmationButtonProps) {
  const [
    canConfirm,
    setCanConfirm,
  ] =
    useState(
      false,
    );


  useEffect(() => {
    const timeout =
      window.setTimeout(
        () => {
          setCanConfirm(
            true,
          );
        },
        CONFIRMATION_DELAY_MS,
      );


    return () =>
      window.clearTimeout(
        timeout,
      );
  }, []);


  return (
    <div>
      <button
        type="button"
        onClick={
          onConfirm
        }
        disabled={
          !canConfirm
        }
        className={`wayco-btn wayco-btn-primary disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      >
        {canConfirm
          ? label
          : waitingLabel}
      </button>

      <p className="mt-4 text-center text-[12px] text-[#8A8984]">
        {canConfirm
          ? "Presioná Entendido para continuar."
          : "Leé la información antes de continuar."}
      </p>
    </div>
  );
}