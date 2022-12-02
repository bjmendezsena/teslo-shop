import { IUser } from "../../interfaces";
import { AuthState } from "./";

type AuthActionType =
  | {
      type: "[Auth]- login";
      payload: IUser;
    }
  | {
      type: "[Auth]- logout";
    };

export const authReducer = (
  state: AuthState,
  action: AuthActionType
): AuthState => {
  switch (action.type) {
    case "[Auth]- login":
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    case "[Auth]- logout":
      return {
        ...state,
        user: undefined,
        isLoggedIn: false,
      };

    default:
      return state;
  }
};
