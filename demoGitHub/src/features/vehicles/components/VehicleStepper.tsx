import { Check } from "lucide-react";

export function VehicleStepper({
  step,
}: {
  step: 1 | 2 | 3;
}) {
  return (
    <div className="mt-5 flex items-center gap-2">
      {[1, 2, 3].map((number, index) => {
        const completed = step > number;
        const active = step === number;

        return (
          <div
            key={number}
            className="flex flex-1 items-center gap-2"
          >
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
              style={{
                background:
                  completed || active ? "#1D9E75" : "transparent",
                color:
                  completed || active ? "white" : "#9B9A96",
                border:
                  completed || active
                    ? "none"
                    : "1px solid #D3D1C7",
              }}
            >
              {completed ? (
                <Check
                  className="h-3.5 w-3.5"
                  strokeWidth={3}
                />
              ) : (
                number
              )}
            </div>

            {index < 2 && (
              <div
                className="h-px flex-1"
                style={{
                  background:
                    step > number ? "#1D9E75" : "#E2E0D8",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
