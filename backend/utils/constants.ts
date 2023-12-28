import { IUser } from "../types/globals";

export const emptyLot: IUser = {
  id: "N/A",
  name: "N/A",
  email: "N/A",
  username: null,
  password: null,
  captureDate: null,
  browser: null,
  ip: null,
  os: null,
  country: null,
  countryCode: null,
  city: null,
  isp: null,
  captured: false,
  sended: false,
  read: false,
  attempts: 0,
  clicks: 0,
  visits: 0,
};
