import React, { FC } from "react";
import { GetServerSideProps } from "next";
import { Box, Button, Grid, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { TSForm } from "../../components/ui";
import { countries } from "../../utils";
import { RegisterOptions } from "react-hook-form";
import { useRouter } from "next/router";
import { ShippingAddress } from "../../interfaces";
import { useCartContext } from "../../context/cart/CartContext";

const inputOptions: RegisterOptions = {
  required: "Requerido",
};

interface FormData extends ShippingAddress {}

interface AddressPageProps {
  shippingAddress?: ShippingAddress;
}

const AddressPage: FC<AddressPageProps> = ({ shippingAddress }) => {
  const router = useRouter();

  const { updateAddress } = useCartContext();

  const onSubmit = (data: FormData) => {
    updateAddress(data);
    router.push("/checkout/summary");
  };

  return (
    <ShopLayout
      title='Dirección'
      pageDescription='Confirmar dirección del destino'
    >
      <Typography variant='h1'>Dirección</Typography>
      <TSForm
        onSubmit={onSubmit}
        form={{
          mode: "onChange",
          defaultValues: shippingAddress,
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            mt: 2,
          }}
        >
          <Grid item xs={12} sm={6}>
            <TSForm.TSTextField
              options={inputOptions}
              label='Nombre'
              variant='filled'
              fullWidth
              style={{
                borderRadius: "5px",
              }}
              name='firstName'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TSForm.TSTextField
              options={inputOptions}
              label='Apellidos'
              variant='filled'
              fullWidth
              style={{
                borderRadius: "5px",
              }}
              name='lastName'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TSForm.TSTextField
              options={inputOptions}
              label='Dirección'
              variant='filled'
              fullWidth
              style={{
                borderRadius: "5px",
              }}
              name='address'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TSForm.TSTextField
              label='Dirección 2'
              variant='filled'
              fullWidth
              style={{
                borderRadius: "5px",
              }}
              name='address2'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TSForm.TSTextField
              options={inputOptions}
              label='Código postal'
              variant='filled'
              fullWidth
              style={{
                borderRadius: "5px",
              }}
              name='zip'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TSForm.TSTextField
              options={inputOptions}
              name='city'
              label='Ciudad'
              variant='filled'
              fullWidth
              style={{
                borderRadius: "5px",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TSForm.TSTextField
              options={inputOptions}
              name='country'
              as='select'
              label='País'
              defaultValue={shippingAddress?.country || countries[0].code}
              selectOptions={countries.map((country) => ({
                value: country.code,
                label: country.name,
              }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TSForm.TSTextField
              options={inputOptions}
              label='Teléfono'
              variant='filled'
              fullWidth
              style={{
                borderRadius: "5px",
              }}
              name='phone'
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 5,
          }}
          display='flex'
          justifyContent='center'
        >
          <Button
            type='submit'
            color='secondary'
            className='circular-btn'
            size='large'
          >
            Revisar pedido
          </Button>
        </Box>
      </TSForm>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // const { token } = req.cookies;

  const shippingAddress: ShippingAddress = {
    firstName: req.cookies["firstName"] || "",
    lastName: req.cookies["lastName"] || "",
    address: req.cookies["address"] || "",
    address2: req.cookies["address2"] || "",
    zip: req.cookies["zip"] || "",
    city: req.cookies["city"] || "",
    country: req.cookies["country"] || countries[0].code,
    phone: req.cookies["phone"] || "",
  };
  // let validToken = false;

  // try {
  //   await isValidToken(token);
  //   validToken = true;
  // } catch (error) {
  //   validToken = false;
  // }

  // if (!validToken) {
  //   return {
  //     redirect: {
  //       destination: "/auth/login?p=checkout/address",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {
      shippingAddress,
    },
  };
};

export default AddressPage;
