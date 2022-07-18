import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Link,
  Chip,
} from "@mui/material";
import NextLink from "next/link";
import React from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";

const OrderPage = () => {
  return (
    <ShopLayout
      title='Resumen de la orden ABC123'
      pageDescription='Resumen de la orden'
    >
      <Typography variant='h1' component='h1'>
        Orden: ABC123
      </Typography>
      {/* <Chip
        sx={{
          my: 2,
        }}
        label='Pendiente de pago'
        variant='outlined'
        color='error'
        icon={<CreditCardOffOutlined />}
      /> */}
      <Chip
        sx={{
          my: 2,
        }}
        label='Orden ya fue pagada'
        variant='outlined'
        color='success'
        icon={<CreditScoreOutlined />}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2' component='h2'>
                Resumen (3 productos)
              </Typography>
              <Divider sx={{ my8: 1 }} />
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>
                  Dirección de entrega
                </Typography>
                <Box display='flex' justifyContent='end'>
                  <NextLink href='/checkout/address' passHref>
                    <Link underline='always'>Editar</Link>
                  </NextLink>
                </Box>
              </Box>

              <Typography>Lewis Mendez</Typography>
              <Typography>Pl. Blocs la florida, 17F, 1-1</Typography>
              <Typography>Barcelona, 08905</Typography>
              <Typography>España</Typography>
              <Typography>+34 675927020</Typography>
              <Divider sx={{ my8: 1 }} />
              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <h1>Pagar</h1>
                <Chip
                  sx={{
                    my: 2,
                  }}
                  label='Orden ya fue pagada'
                  variant='outlined'
                  color='success'
                  icon={<CreditScoreOutlined />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;
