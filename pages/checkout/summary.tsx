import {
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Button,
  Typography,
  Link,
} from "@mui/material";
import React from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import NextLink from "next/link";
const SummaryPage = () => {
  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
      <Typography variant='h1' component='h1'>
        Resumen de la orden
      </Typography>
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
                <Button color='secondary' className='circular-btn' fullWidth>
                  Confirmar orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
