import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Button,
  Typography,
  Link,
  Chip,
} from "@mui/material";
import Cookies from "js-cookie";
import { countries } from "../../utils";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import NextLink from "next/link";
import { useCartContext } from "../../context";

const SummaryPage = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } = useCartContext();

  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    if (!Cookies.get("firstName")) {
      router.push("/checkout/address");
    }
  }, []);

  const onCreateOrder = async () => {
    setIsPosting(true);
    const { hasError, message } = await createOrder();

    if (hasError) {
      setErrorMessage(message);
      setIsPosting(false);
      return;
    }

    router.replace(`/orders/${message}`);
  };

  const { address, city, country, firstName, lastName, phone, zip, address2 } =
    shippingAddress || {};

  if (!shippingAddress) return null;

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
                Resumen ({numberOfItems}{" "}
                {numberOfItems === 1 ? "producto" : "productos"})
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

              <Typography>{firstName + " " + lastName}</Typography>
              <Typography>{address}</Typography>
              {address2 && <Typography>{address2}</Typography>}
              <Typography>{phone}</Typography>
              <Typography>
                {city}, {zip}
              </Typography>
              <Typography>
                {countries.find((c) => c.code === country)?.name}
              </Typography>
              <Divider sx={{ my8: 1 }} />
              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Button
                  disabled={isPosting}
                  color='secondary'
                  className='circular-btn'
                  fullWidth
                  onClick={onCreateOrder}
                >
                  Confirmar orden
                </Button>
                <Chip
                  color='error'
                  label={errorMessage}
                  sx={{
                    display: errorMessage ? "flex" : "none",
                    mt: 2,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
