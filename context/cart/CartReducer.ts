import { CartState } from ".";
import { ICartProduct, ShippingAddress } from "../../interfaces";
import { updateProductinCart } from "../../helpers";

type CartActionType =
  | {
      type: "[Cart]- LoadCart from kookies | storage";
      payload: ICartProduct[];
    }
  | {
      type: "[Cart]- Update Cart";
      payload: ICartProduct[];
    }
  | {
      type: "[Cart]- Update cart quantity";
      payload: ICartProduct;
    }
  | {
      type: "[Cart]- Remove product in cart";
      payload: ICartProduct;
    }
  | {
      type: "[Cart]- Load address from cookies";
      payload: ShippingAddress;
    }
  | {
      type: "[Cart]- Update shipping address from cookies";
      payload: ShippingAddress;
    }
  | {
      type: "[Cart]- Update order summary";
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    }
  | {
      type: "[Cart]- Order complete";
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
        isLoaded: true,
      };
    case "[Cart]- Update Cart":
      return {
        ...state,
        cart: [...action.payload],
      };
    case "[Cart]- Update cart quantity":
      return {
        ...state,
        cart: state.cart.map((product) =>
          updateProductinCart(product, action.payload)
        ),
      };
    case "[Cart]- Remove product in cart":
      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            !(
              product._id === action.payload._id &&
              product.size === action.payload.size
            )
        ),
      };
    case "[Cart]- Update order summary":
      return {
        ...state,
        ...action.payload,
      };
    case "[Cart]- Update shipping address from cookies":
    case "[Cart]- Load address from cookies":
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case "[Cart]- Order complete":
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
      };
    default:
      return state;
  }
};
