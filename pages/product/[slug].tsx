import {
  GetStaticProps,
  NextPage,
  GetServerSideProps,
  GetStaticPaths,
} from "next";
import { Box, Button, Grid, Typography, Chip } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { ProductSlideshow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { IProduct } from "../../interfaces";
import {
  getProductBySlug,
  getAllProductsSlugs,
} from "../../database/dbProducts";

interface Props {
  product: IProduct;
}

const SlugPage: NextPage<Props> = ({ product }) => {
  // const router = useRouter();
  // const { products: product, isLoading } = useProducts(
  //   `/products/${router.query.slug}`
  // );

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            <Typography variant='subtitle1' component='h2'>
              {`$${product.price}`}
            </Typography>
            <Box sx={{ my: 2 }} flexDirection='column'>
              <Typography variant='subtitle2' component='h2'>
                Cantidad
              </Typography>
              <ItemCounter />
              <SizeSelector sizes={product.sizes} />
            </Box>
            <Button color='secondary' className='circular-btn'>
              Agregar al carrito
            </Button>
            {/* <Chip
              label='Producto no disponible'
              color='error'
              variant='outlined'
            /> */}
            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await getAllProductsSlugs();

  const paths = slugs.map(({ slug }) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default SlugPage;
