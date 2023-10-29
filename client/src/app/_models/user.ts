import { v4 as uuidv4 } from "uuid";
import { GUID } from "./types";

export interface IUser {
  id: GUID;
  firstName: string;
  lastName: string;
  bio: string;
  emailAddress: string;
  token: string;
}
export class User implements IUser {
  id: GUID = uuidv4();
  firstName!: string;
  lastName!: string;
  bio!: string;
  emailAddress!: string;
  token!: string;
}

export interface IRegisterUser {
  emailAddress: string;
  firstName: string;
  lastName: string;
  password: string;
}
export class RegisterUser implements IRegisterUser {
  firstName!: string;
  lastName!: string;
  emailAddress!: string;
  password!: string;
}

export interface ILoginUser {
  emailAddress: string;
  password: string;
}
export class LoginUser implements ILoginUser {
  emailAddress!: string;
  password!: string;
}

export interface IEditUser {
  id: GUID;
  firstName: string;
  lastName: string;
  bio: string;
}

export class EditUser implements IEditUser {
  id!: GUID;
  firstName!: string;
  lastName!: string;
  bio!: string;
}
