
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "@tanstack/react-router";

import {
  toast,
} from "sonner";

import {
  Google_account_not_registered_error,
  renderGoogleAuthButton,
  type GoogleAuthMode,
} from "../services/google_auth.service";


export function useGoogleAuth(
  mode:
    GoogleAuthMode,

  termsAccepted:
    boolean = false,
) {
  const navigate =
    useNavigate();


  const containerRef =
    useRef<
      HTMLDivElement | null
    >(
      null,
    );


  /*
   * Conservamos el estado actualizado de aceptación
   * sin reinicializar Google Identity Services.
   */
  const termsAcceptedRef =
    useRef(
      termsAccepted,
    );

  termsAcceptedRef.current =
    termsAccepted;


  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );


  useEffect(() => {
    const container =
      containerRef.current;

    if (
      container === null
    ) {
      return;
    }

    const googleContainer:
      HTMLElement =
      container;


    let cancelled =
      false;


    async function initializeGoogle() {
      try {
        await renderGoogleAuthButton({
          container:
            googleContainer,

          mode,

          /*
           * El servicio consultará esta función
           * cuando Google entregue la credencial.
           */
          canRegister:
            () =>
              termsAcceptedRef.current,

          onSuccess: (
            result,
          ) => {
            if (
              cancelled
            ) {
              return;
            }


            if (
              result.destination ===
              "home"
            ) {
              void navigate({
                to:
                  "/auth/home",
              });

              return;
            }


            void navigate({
              to:
                "/auth/complete-profile",
            });
          },

          onError: (
            error,
          ) => {
            if (
              cancelled
            ) {
              return;
            }


            console.error(
              "Error al iniciar sesión con Google:",
              error,
            );


            if (
              error instanceof
                Google_account_not_registered_error
            ) {
              toast.error(
                error.message,
              );

              return;
            }


            toast.error(
              error instanceof Error
                ? error.message
                : "No pudimos conectar con Google.",
            );
          },
        });


        if (
          !cancelled
        ) {
          setLoading(
            false,
          );
        }
      } catch (
        error
      ) {
        console.error(
          "Error configurando Google Identity Services:",
          error,
        );


        if (
          !cancelled
        ) {
          setLoading(
            false,
          );


          toast.error(
            error instanceof Error
              ? error.message
              : "No pudimos cargar Google.",
          );
        }
      }
    }


    void initializeGoogle();


    return () => {
      cancelled =
        true;

      googleContainer
        .replaceChildren();
    };
  }, [
    mode,
    navigate,
  ]);


  return {
    containerRef,
    loading,
  };
}
