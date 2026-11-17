import {
  type ReactNode,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  tall?: boolean;
};

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  tall = false,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="wayco-sheet-overlay absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Cerrar"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "bottom-sheet-title" : undefined}
        className={`wayco-sheet-panel relative w-full max-w-[420px] rounded-t-[24px] bg-white shadow-2xl ${
          tall ? "flex h-[92vh] flex-col" : ""
        }`}
      >
        <div className="mx-auto mb-2 mt-3 h-1 w-9 shrink-0 rounded-full bg-[var(--border-color)]" />

        <div
          className={`px-6 pb-8 pt-2 ${
            tall ? "flex-1 overflow-y-auto" : ""
          }`}
        >
          {title && (
            <h2
              id="bottom-sheet-title"
              className="wayco-title mb-4 text-[20px]"
            >
              {title}
            </h2>
          )}

          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
