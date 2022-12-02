import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { useCartContext } from "../../context";
import { useRouter } from "next/router";

const CartPage = () => {
  const router = useRouter();
  const { isLoaded, cart} = useCartContext();

  useEffect(() => {
    if (isLoaded && cart.length === 0) {
      router.replace("/cart/empty");
    }
  }, [isLoaded, cart, router]);

  

  
  const renderContent = () => {
    return (
      <>
        <Typography variant='h1' component='h1'>
          Carrito
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
            <CartList editable />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Card className='summary-card'>
              <CardContent>
                <Typography variant='h2' component='h2'>
                  Orden
                </Typography>
                <Divider sx={{ my8: 1 }} />
                <OrderSummary />
                <Box sx={{ mt: 3 }}>
                  <Button
                   color='secondary'
                    className='circular-btn' 
                    fullWidth
                    href='/checkout/address'
                    >
                    Checkout
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  };
  const showCartContent =  !(!isLoaded || cart.length === 0);
  return (
    <ShopLayout
      title='Carrito -3'
      pageDescription='Carrito de compras'
    >
      {
        showCartContent ? renderContent() : null
      }
    </ShopLayout>
  );
};

export default CartPage;
