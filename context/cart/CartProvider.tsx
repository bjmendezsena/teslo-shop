import { useReducer, PropsWithChildren, useEffect } from "react";
import Cookie from "js-cookie";
import { ICartProduct } from "../../interfaces";
import { CartContext, cartReducer } from "./";
import { summQuantityOfProductInCart } from "../../helpers";

const CART_COOKIE_KEY = "cart";
export interface CartState {
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
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

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => prev + current.quantity,
      0
    );
    const subTotal = state.cart.reduce(
      (prev, current) => current.price * current.quantity + prev,
      0
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (1 + taxRate),
    };
    dispatch({
      type: "[Cart]- Update order summary",
      payload: orderSummary,
    })
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

    const updatedProducts = state.cart.map((prod) =>
      summQuantityOfProductInCart(prod, product)
    );

    dispatch({
      type: "[Cart]- Update Cart",
      payload: updatedProducts,
    });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({
      type: "[Cart]- Update cart quantity",
      payload: product,
    });
  };

  const removeProductFromCart = (product: ICartProduct) => {
    dispatch({
      type: "[Cart]- Remove product in cart",
      payload: product,
    });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartQuantity,
        removeCartProduct: removeProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
