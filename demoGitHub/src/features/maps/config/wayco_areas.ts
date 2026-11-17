export type WaycoArea = {
  name:
    string;

  description:
    string;

  principal:
    boolean;

  center: {
    lat:
      number;

    lng:
      number;
  };

  bounds: {
    north:
      number;

    south:
      number;

    east:
      number;

    west:
      number;
  };

  zoom:
    number;
};


export const WAYCO_AREAS:
  WaycoArea[] = [
    {
      name:
        "La Plata",

      description:
        "Buenos Aires, Argentina",

      principal:
        true,

      center: {
        lat:
          -34.9214,

        lng:
          -57.9544,
      },

      bounds: {
        north:
          -34.8400,

        south:
          -35.0800,

        east:
          -57.8000,

        west:
          -58.1000,
      },

      zoom:
        12,
    },

    {
      name:
        "CABA",

      description:
        "Ciudad Autónoma de Buenos Aires",

      principal:
        true,

      center: {
        lat:
          -34.6037,

        lng:
          -58.3816,
      },

      bounds: {
        north:
          -34.5265,

        south:
          -34.7050,

        east:
          -58.3350,

        west:
          -58.5315,
      },

      zoom:
        12,
    },

    {
      name:
        "Hudson",

      description:
        "Partido de Berazategui",

      principal:
        false,

      center: {
        lat:
          -34.7915,

        lng:
          -58.1395,
      },

      bounds: {
        north:
          -34.7550,

        south:
          -34.8350,

        east:
          -58.0850,

        west:
          -58.1900,
      },

      zoom:
        13,
    },

    {
      name:
        "Quilmes",

      description:
        "Partido de Quilmes",

      principal:
        false,

      center: {
        lat:
          -34.7206,

        lng:
          -58.2545,
      },

      bounds: {
        north:
          -34.6650,

        south:
          -34.7900,

        east:
          -58.1800,

        west:
          -58.3300,
      },

      zoom:
        12,
    },

    {
      name:
        "Berazategui",

      description:
        "Partido de Berazategui",

      principal:
        false,

      center: {
        lat:
          -34.7634,

        lng:
          -58.2113,
      },

      bounds: {
        north:
          -34.7100,

        south:
          -34.8350,

        east:
          -58.1200,

        west:
          -58.2600,
      },

      zoom:
        12,
    },
  ];


export function find_wayco_area(
  name:
    string,
): WaycoArea | null {
  return (
    WAYCO_AREAS.find(
      (
        area,
      ) =>
        area.name ===
        name,
    ) ??
    null
  );
}