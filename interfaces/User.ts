import { IBaseInterface } from "./BaseInterface";
export interface IUser extends IBaseInterface {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "client";
}
