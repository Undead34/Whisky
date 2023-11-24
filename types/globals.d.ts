export interface IUser {
  id: string;
  name: string;
  email: string;
  username: string | null;
  password: string | null;
  captureDate: Date | null;
  browser: string | null;
  ip: string | null;
  os: string | null;
  country: string | null;
  countryCode: string | null;
  city: string | null;
  isp: string | null;
  sended: boolean;
  captured: boolean;
  read: boolean;
  attempts: number;
  clicks: number;
  visits: number;
}
