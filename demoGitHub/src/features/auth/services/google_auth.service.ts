
import {
  supabase,
} from "@/lib/supabase";

import {
  api_post,
} from "@/lib/api";


/* =========================================================
 * TYPES
 * ======================================================= */

export type GoogleAuthMode =
  | "login"
  | "register";


export type GoogleAccountStatus = {
  registered:
    boolean;

  profileComplete:
    boolean;
};


export type GoogleAuthenticationResult = {
  destination:
    "home" |
    "complete-profile";
};


/* =========================================================
 * GOOGLE IDENTITY TYPES
 * ======================================================= */

type GoogleCredentialResponse = {
  credential?:
    string;
};


type GoogleAccountsId = {
  initialize:
    (
      options: {
        client_id:
          string;

        callback:
          (
            response:
              GoogleCredentialResponse,
          ) => void;

        auto_select?:
          boolean;

        cancel_on_tap_outside?:
          boolean;
      },
    ) => void;

  renderButton:
    (
      parent:
        HTMLElement,

      options: {
        type?:
          "standard";

        theme?:
          "outline";

        size?:
          "large";

        text?:
          "continue_with";

        shape?:
          "rectangular";

        logo_alignment?:
          "left";

        width?:
          number;

        locale?:
          string;
      },
    ) => void;
};


type GoogleIdentityGlobal = {
  accounts: {
    id:
      GoogleAccountsId;
  };
};


declare global {
  interface Window {
    google?:
      GoogleIdentityGlobal;
  }
}


/* =========================================================
 * CONFIG
 * ======================================================= */

const GOOGLE_IDENTITY_SCRIPT_URL =
  "https://accounts.google.com/gsi/client";


const googleClientId =
  import.meta.env
    .VITE_GOOGLE_CLIENT_ID
    ?.trim();


let googleScriptPromise:
  Promise<void> | null =
  null;


let googleInitialized =
  false;


/*
 * Google Identity Services utiliza un único callback
 * configurado durante initialize().
 *
 * Como initialize() debe ejecutarse una sola vez,
 * mantenemos acá la configuración correspondiente
 * al botón actualmente renderizado.
 *
 * canRegister consulta el estado actual de aceptación
 * de los términos y condiciones.
 */
let currentAuthParams: {
  mode:
    GoogleAuthMode;

  canRegister:
    () => boolean;

  onSuccess:
    (
      result:
        GoogleAuthenticationResult,
    ) => void;

  onError:
    (
      error:
        unknown,
    ) => void;
} | null =
  null;


/* =========================================================
 * LOAD GOOGLE IDENTITY SERVICES
 * ======================================================= */

function loadGoogleIdentityServices():
  Promise<void> {
  if (
    window.google
      ?.accounts
      ?.id
  ) {
    return Promise.resolve();
  }


  if (
    googleScriptPromise
  ) {
    return googleScriptPromise;
  }


  googleScriptPromise =
    new Promise<void>(
      (
        resolve,
        reject,
      ) => {
        const existingScript =
          document.querySelector<
            HTMLScriptElement
          >(
            `script[src="${GOOGLE_IDENTITY_SCRIPT_URL}"]`,
          );


        if (
          existingScript
        ) {
          existingScript
            .addEventListener(
              "load",
              () =>
                resolve(),
              {
                once:
                  true,
              },
            );

          existingScript
            .addEventListener(
              "error",
              () =>
                reject(
                  new Google_identity_loading_error(),
                ),
              {
                once:
                  true,
              },
            );

          return;
        }


        const script =
          document.createElement(
            "script",
          );


        script.src =
          GOOGLE_IDENTITY_SCRIPT_URL;

        script.async =
          true;

        script.defer =
          true;


        script.onload =
          () =>
            resolve();


        script.onerror =
          () =>
            reject(
              new Google_identity_loading_error(),
            );


        document.head
          .appendChild(
            script,
          );
      },
    );


  return googleScriptPromise;
}


/* =========================================================
 * INITIALIZE GOOGLE
 * ======================================================= */

function initializeGoogleIdentity(
  google:
    GoogleIdentityGlobal,
): void {
  if (
    googleInitialized
  ) {
    return;
  }


  if (
    !googleClientId
  ) {
    throw new Google_identity_configuration_error();
  }


  google.accounts.id
    .initialize({
      client_id:
        googleClientId,

      auto_select:
        false,

      cancel_on_tap_outside:
        true,

      callback: (
        response,
      ) => {
        const authParams =
          currentAuthParams;


        if (
          !authParams
        ) {
          return;
        }


        /*
         * Conservamos la configuración del flujo
         * que recibió la credencial.
         */
        void handleGoogleCredential({
          credential:
            response.credential,

          mode:
            authParams.mode,

          canRegister:
            authParams.canRegister,
        })
          .then(
            authParams.onSuccess,
          )
          .catch(
            authParams.onError,
          );
      },
    });


  googleInitialized =
    true;
}


/* =========================================================
 * RENDER GOOGLE BUTTON
 * ======================================================= */

export async function renderGoogleAuthButton(
  params: {
    container:
      HTMLElement;

    mode:
      GoogleAuthMode;

    canRegister:
      () => boolean;

    onSuccess:
      (
        result:
          GoogleAuthenticationResult,
      ) => void;

    onError:
      (
        error:
          unknown,
      ) => void;
  },
): Promise<void> {
  if (
    !googleClientId
  ) {
    throw new Google_identity_configuration_error();
  }


  await loadGoogleIdentityServices();


  const google =
    window.google;


  if (
    !google
  ) {
    throw new Google_identity_loading_error();
  }


  /*
   * Actualizamos el contexto que utilizará
   * el callback global de Google.
   */
  currentAuthParams = {
    mode:
      params.mode,

    canRegister:
      params.canRegister,

    onSuccess:
      params.onSuccess,

    onError:
      params.onError,
  };


  /*
   * initialize() solamente se ejecutará
   * la primera vez.
   */
  initializeGoogleIdentity(
    google,
  );


  /*
   * El botón sí puede volver a renderizarse.
   */
  params.container
    .replaceChildren();


  google.accounts.id
    .renderButton(
      params.container,
      {
        type:
          "standard",

        theme:
          "outline",

        size:
          "large",

        text:
          "continue_with",

        shape:
          "rectangular",

        logo_alignment:
          "left",

        width:
          342,

        locale:
          "es",
      },
    );
}


/* =========================================================
 * HANDLE GOOGLE CREDENTIAL
 * ======================================================= */

async function handleGoogleCredential(
  params: {
    credential:
      string | undefined;

    mode:
      GoogleAuthMode;

    canRegister:
      () => boolean;
  },
): Promise<GoogleAuthenticationResult> {
  /*
   * REGISTRO:
   *
   * Antes de consultar el backend o autenticar
   * con Supabase, verificamos que la casilla
   * de términos y condiciones esté aceptada.
   *
   * LOGIN:
   *
   * Esta validación no se aplica.
   */
  if (
    params.mode ===
      "register" &&
    !params.canRegister()
  ) {
    throw new Google_terms_not_accepted_error();
  }


  const credential =
    params.credential
      ?.trim();


  if (
    !credential
  ) {
    throw new Invalid_google_credential_error();
  }


  /*
   * PRIMER PASO:
   *
   * Wayco valida el token directamente contra
   * nuestro backend.
   *
   * En este momento todavía NO llamamos
   * a Supabase Auth.
   */
  const accountStatus =
    await api_post<
      GoogleAccountStatus,
      {
        idToken:
          string;
      }
    >(
      "/api/auth/google/account-status",
      {
        idToken:
          credential,
      },
      {
        authenticated:
          false,
      },
    );


  /*
   * LOGIN:
   *
   * Si la cuenta no existe en public.users,
   * detenemos el flujo acá.
   *
   * Supabase Auth todavía no fue llamado,
   * por lo que auth.users NO puede crearse.
   */
  if (
    params.mode ===
      "login" &&
    !accountStatus.registered
  ) {
    throw new Google_account_not_registered_error();
  }


  /*
   * REGISTRO:
   *
   * Volvemos a comprobar la aceptación
   * después de la consulta al backend.
   *
   * Esto cubre el caso en que el usuario
   * desmarque la casilla mientras la
   * consulta está en curso.
   */
  if (
    params.mode ===
      "register" &&
    !params.canRegister()
  ) {
    throw new Google_terms_not_accepted_error();
  }


  /*
   * Recién después de que Wayco autorizó
   * el flujo utilizamos Supabase.
   */
  const {
    error,
  } =
    await supabase.auth
      .signInWithIdToken({
        provider:
          "google",

        token:
          credential,
      });


  if (
    error
  ) {
    throw error;
  }


  /*
   * Cuenta Wayco existente.
   */
  if (
    accountStatus.registered &&
    accountStatus.profileComplete
  ) {
    return {
      destination:
        "home",
    };
  }


  /*
   * Registro Google nuevo.
   */
  return {
    destination:
      "complete-profile",
  };
}


/* =========================================================
 * ERRORS
 * ======================================================= */

export class Google_account_not_registered_error
  extends Error {
  constructor() {
    super(
      "No existe una cuenta de Wayco asociada a este correo. Registrate primero para continuar.",
    );

    this.name =
      "Google_account_not_registered_error";
  }
}


export class Google_terms_not_accepted_error
  extends Error {
  constructor() {
    super(
      "Para registrarse con Google, es necesario aceptar los términos y condiciones.",
    );

    this.name =
      "Google_terms_not_accepted_error";
  }
}


export class Google_identity_configuration_error
  extends Error {
  constructor() {
    super(
      "Google no está configurado correctamente en Wayco.",
    );

    this.name =
      "Google_identity_configuration_error";
  }
}


export class Google_identity_loading_error
  extends Error {
  constructor() {
    super(
      "No se pudo cargar el inicio de sesión de Google.",
    );

    this.name =
      "Google_identity_loading_error";
  }
}


export class Invalid_google_credential_error
  extends Error {
  constructor() {
    super(
      "Google no devolvió una credencial válida.",
    );

    this.name =
      "Invalid_google_credential_error";
  }
}
