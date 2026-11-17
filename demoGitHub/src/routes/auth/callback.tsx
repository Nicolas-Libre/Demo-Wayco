import {
  useEffect,
} from "react";

import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  toast,
} from "sonner";

import {
  supabase,
} from "@/lib/supabase";


export const Route =
  createFileRoute(
    "/auth/callback",
  )({
    component:
      OAuthCallbackPage,
  });


function OAuthCallbackPage() {
  const navigate =
    useNavigate();


  useEffect(() => {
    async function handleLegacyCallback() {
      try {
        const {
          data: {
            session,
          },

          error,
        } =
          await supabase.auth
            .getSession();


        if (
          error
        ) {
          throw error;
        }


        if (
          session
        ) {
          await navigate({
            to:
              "/auth/home",

            replace:
              true,
          });

          return;
        }


        await navigate({
          to:
            "/auth/login",

          replace:
            true,
        });
      } catch (
        error
      ) {
        console.error(
          "Error procesando callback OAuth:",
          error,
        );


        toast.error(
          "No pudimos completar el inicio de sesión.",
        );


        await navigate({
          to:
            "/auth/login",

          replace:
            true,
        });
      }
    }


    void handleLegacyCallback();
  }, [
    navigate,
  ]);


  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-[16px] font-semibold text-[#111110]">
          Completando inicio de sesión...
        </p>

        <p className="mt-2 text-[14px] text-[#77756F]">
          Esperá unos segundos.
        </p>
      </div>
    </main>
  );
}