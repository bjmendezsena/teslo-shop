import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Typography, Box, Link } from "@mui/material";
import React from "react";
import { ShopLayout } from "../../components/layouts";
import { NotFoundComponent } from "../../components/ui";
import NextLink from "next/link";

const EmptyPage = () => {
  return (
    <ShopLayout
      title='Carrito vacío'
      pageDescription='No hay artículos en el carrito de compras'
    >
      <NotFoundComponent>
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Typography>Su carrito está vacío</Typography>
          <NextLink href='/' passHref>
            <Link typography='h4' color='secondary'>
              Regresar
            </Link>
          </NextLink>
        </Box>
      </NotFoundComponent>
    </ShopLayout>
  );
};

export default EmptyPage;
