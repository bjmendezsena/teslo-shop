import { useReducer, PropsWithChildren, useEffect } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { ICartProduct } from "../../interfaces";
import { CartContext, cartReducer } from "./";
import {
  summQuantityOfProductInCart,
  getAddressFromCookies,
  saveAddressToCookies,
} from "../../helpers";
import { tesloApi } from "../../api";
import { IOrder, ShippingAddress } from "../../interfaces/Order";

const CART_COOKIE_KEY = "cart";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get(CART_COOKIE_KEY);
      const cart = cookieProducts ? JSON.parse(cookieProducts) : [];

      dispatch({
        type: "[Cart]- LoadCart from kookies | storage",
        payload: cart,
      });
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
    fetchAddressFromCookies();
  }, []);

  const fetchAddressFromCookies = () => {
    const shippingAddress = getAddressFromCookies();

    if (!shippingAddress) return;

    dispatch({
      type: "[Cart]- Load address from cookies",
      payload: shippingAddress,
    });
  };

  const updateAddress = (address: ShippingAddress) => {
    saveAddressToCookies(address);
    dispatch({
      type: "[Cart]- Update shipping address from cookies",
      payload: address,
    });
  };

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
    });
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

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.shippingAddress) {
      throw new Error("No hay dirección de entrega");
    }

    const body: IOrder = {
      orderItems: state.cart.map((product) => ({
        ...product,
        size: product.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };

    try {
      const { data } = await tesloApi.post("/orders", body);

      dispatch({
        type: "[Cart]- Order complete",
      });

      return { hasError: false, message: data._id! };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const { message } = (error.response?.data || {
          message: "Error desconocido",
        }) as { message: string };
        return {
          hasError: true,
          message,
        };
      }
      return {
        hasError: true,
        message: "Error no controlado, hable con el administrador",
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartQuantity,
        removeCartProduct: removeProductFromCart,
        updateAddress,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
