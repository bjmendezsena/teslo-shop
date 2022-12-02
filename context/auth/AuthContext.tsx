import { createContext, useContext } from "react";
import { IUser, LoginRequest, RegisterRequest } from "../../interfaces";

interface ContextProps {
  isLoggedIn: boolean;
  user?: IUser;
  login: (user: LoginRequest) => Promise<boolean>;
  logout: () => void;
  registerUser: (request: RegisterRequest) => Promise<{
    hasError: boolean;
    message?: string;
  }>;
}

export const AuthContext = createContext({} as ContextProps);

export const useAuthContext = () => useContext(AuthContext);