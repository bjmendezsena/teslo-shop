import { useReducer, PropsWithChildren, useEffect } from "react";
import Cookie from "js-cookie";
import { ICartProduct } from "../../interfaces";
import { CartContext, cartReducer } from "./";

const CART_COOKIE_KEY = "cart";
export interface CartState {
  cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
};

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get(CART_COOKIE_KEY);
      const cart = cookieProducts ? JSON.parse(cookieProducts) : [];

      if (cart.length > 0) {
        dispatch({
          type: "[Cart]- LoadCart from kookies | storage",
          payload: cart,
        });
      }
    } catch (error) {
      dispatch({
        type: "[Cart]- LoadCart from kookies | storage",
        payload: [],
      });
    }
  }, []);
  useEffect(() => {
    Cookie.set(CART_COOKIE_KEY, JSON.stringify(state.cart));
  }, [state.cart]);

  const addToCart = (product: ICartProduct) => {
    const productInCart = state.cart.some((item) => item._id === product._id);
    if (!productInCart) {
      return dispatch({
        type: "[Cart]- Update Cart",
        payload: [...state.cart, product],
      });
    }

    const productInCartButDifferentSize = state.cart.some(
      (item) => item._id === product._id && item.size === product.size
    );
    if (!productInCartButDifferentSize) {
      return dispatch({
        type: "[Cart]- Update Cart",
        payload: [...state.cart, product],
      });
    }

    const updatedProducts = state.cart.map((prod) => {
      if (prod._id !== product._id) return prod;
      if (prod.size !== product.size) return prod;
      prod.quantity += product.quantity;
      return prod;
    });

    dispatch({
      type: "[Cart]- Update Cart",
      payload: updatedProducts,
    });
  };
  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
