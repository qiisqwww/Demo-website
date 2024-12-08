import dayjs from "dayjs";

export interface IProfileData {
  username: string;
  email: string;
  birthdate: dayjs.Dayjs;
  photo_url: string;
  role: string;
}
