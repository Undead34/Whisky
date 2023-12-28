import { QuerySnapshot, DocumentData } from "firebase/firestore";

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

export interface TLot {
  id: string;
  type: string;
  name: string;
  nodes: IUser[];
  sended: boolean;
}

export type TUser = { name: string; email: string };

export type TUserInfo = {
  id: string;
  ip: string;
  username: string;
  password: string;
  captureDate: any;
  browser: string;
  os: string;
  country: string;
  countryCode: string;
  city: string;
  isp: string;
  captured: boolean;
};

export type TSnapshot = QuerySnapshot<DocumentData, DocumentData>;

export interface IStats {
  total: number;
  emailed: number;
  captured: number;
  read: number;
  clicks: number;
  users: IUser[];
}
