import { CartState } from "./";
import { ICartProduct } from "../../interfaces";

type CartActionType =
  | {
      type: "[Cart]- LoadCart from kookies | storage";
      payload: ICartProduct[];
    }
  | {
      type: "[Cart]- Update Cart";
      payload: ICartProduct[];
    };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[Cart]- LoadCart from kookies | storage":
      return {
        ...state,
        cart: action.payload,
      };
    case "[Cart]- Update Cart":
      return {
        ...state,
        cart: [...action.payload],
      };
    default:
      return state;
  }
};
