import { ICartProduct } from "../interfaces";

export const updateProductinCart = (
  product: ICartProduct,
  payload: ICartProduct
) => {
    if (product._id !== payload._id) return product;
    if (product.size !== payload.size) return product;
    
    return payload;
};

export const summQuantityOfProductInCart = (
  product: ICartProduct,
  payload: ICartProduct
) => {
    if (product._id !== payload._id) return product;
    if (product.size !== payload.size) return product;
    
    product.quantity += payload.quantity;
    return product;
};
