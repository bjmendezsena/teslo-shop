import { IBaseInterface } from "./BaseInterface";
export interface IUser extends IBaseInterface {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export type Role = "admin" | "client";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}
