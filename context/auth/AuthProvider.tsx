import { useReducer, PropsWithChildren, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { AuthContext, authReducer } from "./";
import { IUser, LoginRequest, RegisterRequest } from "../../interfaces";
import { tesloApi } from "../../api";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import { removeAddressFromCookies } from "../../helpers";
export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const Auth_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);
  const router = useRouter();

  const { data, status } = useSession();

  const login = async (request: LoginRequest): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post("/user/login", request);
      const { token, user } = data;

      Cookies.set("token", token);

      dispatch({
        type: "[Auth]- login",
        payload: user,
      });

      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    request: RegisterRequest
  ): Promise<{
    hasError: boolean;
    message?: string;
  }> => {
    try {
      const { data } = await tesloApi.post("/user/register", request);

      const { token, user } = data;

      Cookies.set("token", token);

      dispatch({
        type: "[Auth]- login",
        payload: user,
      });

      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { message = "" } = (error.response?.data as any) || {};
        return {
          hasError: true,
          message: message,
        };
      }
      return {
        hasError: true,
        message: "No se pudo crear el usuario",
      };
    }
  };

  const checkToken = async () => {
    const token = Cookies.get("token");

    if (!token) {
      return;
    }
    try {
      const { data } = await tesloApi.get("/user/validate-token");
      const { token, user } = data;

      Cookies.set("token", token);

      dispatch({
        type: "[Auth]- login",
        payload: user,
      });
    } catch (error) {
      Cookies.remove("token");
    }
  };

  const logout = () => {
    
    Cookies.remove("cart");
    removeAddressFromCookies();

    dispatch({
      type: "[Auth]- logout",
    });
    signOut();
  };

  useEffect(() => {
    if (status === "authenticated") {
      console.log(data.user);
      dispatch({
        type: "[Auth]- login",
        payload: data.user as IUser,
      });
    }
  }, [status, data]);

  // useEffect(() => {
  //   checkToken();
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
