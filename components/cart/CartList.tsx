import { FC, useContext } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Typography,
} from "@mui/material";

import { ItemCounter } from "../ui";
import { CartContext } from "../../context";
import { useRouter } from "next/router";
import { ICartProduct, IOrderItem } from "../../interfaces";
import { formatCurrency } from "../../utils";

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const router = useRouter();
  const {
    cart,
    updateCartQuantity,
    removeCartProduct: removeProductFromCart,
  } = useContext(CartContext);

  const onNewCartQuantityValue = (
    product: ICartProduct,
    newQuantityValue: number
  ) => {
    const newProduct: ICartProduct = {
      ...product,
      quantity: newQuantityValue,
    };
    updateCartQuantity(newProduct);
  };

  const productToShow = products ? products : cart;

  return (
    <>
      {productToShow.map((product) => (
        <Grid
          key={product.slug + product.size}
          spacing={2}
          sx={{ mb: 1 }}
          container
        >
          <Grid item xs={3}>
            {/* TODO: Llevar a la página del producto */}
            <NextLink href={`/product/${product.slug}`}>
              <Link>
                <CardActionArea>
                  <CardMedia image={product.image} component='img' />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='body1'>{product.title}</Typography>
              <Typography variant='body1'>
                Talla: <strong>{product.size}</strong>
              </Typography>
              {/* Condicional */}
              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  maxValue={10}
                  onUpdateQuantity={(quantity) =>
                    onNewCartQuantityValue(product as ICartProduct, quantity)
                  }
                />
              ) : (
                <Typography variant='h6'>
                  {product.quantity}{" "}
                  {product.quantity > 1 ? "productos" : "producto"}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display='flex'
            alignItems='center'
            flexDirection='column'
          >
            <Typography variant='subtitle1'>
              {formatCurrency(product.price)}
            </Typography>
            {/* Editable */}
            {editable && (
              <Button
                onClick={() => removeProductFromCart(product as ICartProduct)}
                variant='text'
                color='error'
              >
                <Typography variant='body2'>Eliminar</Typography>
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
