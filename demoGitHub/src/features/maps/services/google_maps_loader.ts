import {
  setOptions,
  importLibrary,
} from "@googlemaps/js-api-loader";


let configured =
  false;


function configure_google_maps():
  void {
  if (
    configured
  ) {
    return;
  }


  const api_key =
    import.meta.env
      .VITE_GOOGLE_MAPS_API_KEY
      ?.trim();


  if (
    !api_key
  ) {
    throw new Google_maps_frontend_configuration_error();
  }


  setOptions({
    key:
      api_key,

    v:
      "weekly",

    language:
      "es",

    region:
      "AR",
  });


  configured =
    true;
}


export async function load_maps_library() {
  configure_google_maps();


  return importLibrary(
    "maps",
  );
}


export async function load_marker_library() {
  configure_google_maps();


  return importLibrary(
    "marker",
  );
}


export async function load_places_library() {
  configure_google_maps();


  return importLibrary(
    "places",
  );
}


export async function load_geocoding_library() {
  configure_google_maps();


  return importLibrary(
    "geocoding",
  );
}


export async function load_geometry_library() {
  configure_google_maps();


  return importLibrary(
    "geometry",
  );
}


export class Google_maps_frontend_configuration_error
  extends Error {
  constructor() {
    super(
      "Google Maps no está configurado en el frontend.",
    );

    this.name =
      "Google_maps_frontend_configuration_error";
  }
}