
export type CurrentUserProfile = {
  id:
    string;

  name:
    string;

  surname:
    string;

  email:
    string;

  phone:
    string | null;

  photoUrl:
    string | null;

  averageRating:
    number;

  totalTrips:
    number;

  cbuAlias:
    string | null;

  createdAt:
    string;
};
