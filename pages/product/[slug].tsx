import React, { useContext, useState } from "react";
import {
  GetStaticProps,
  NextPage,
  GetServerSideProps,
  GetStaticPaths,
} from "next";
import { Box, Button, Grid, Typography, Chip } from "@mui/material";
import { useRouter } from "next/router";

import { ShopLayout } from "../../components/layouts/ShopLayout";
import { ProductSlideshow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { ICartProduct, IProduct, ISize } from "../../interfaces";
import {
  getProductBySlug,
  getAllProductsSlugs,
} from "../../database/dbProducts";
import { CartContext } from "../../context";

interface Props {
  product: IProduct;
}

const SlugPage: NextPage<Props> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useContext(CartContext);
  const [tempCardProduct, setTempCardProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const onAddToCart = () => {
    if (!tempCardProduct.size) return;
    addToCart(tempCardProduct);
    setTempCardProduct({
      _id: product._id,
      image: product.images[0],
      price: product.price,
      size: undefined,
      slug: product.slug,
      title: product.title,
      gender: product.gender,
      quantity: 1,
    });
    router.push("/cart");
  };

  const onSelectedSize = (size: ISize) => {
    setTempCardProduct((currentProduct) => ({
      ...currentProduct,
      size,
    }));
  };

  const onUpdateQuantity = (quantity: number) => {
    setTempCardProduct((currentProduct) => ({
      ...currentProduct,
      quantity,
    }));
  };
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
              <ItemCounter
                currentValue={tempCardProduct.quantity}
                onUpdateQuantity={onUpdateQuantity}
                maxValue={product.inStock > 10 ? 10 : product.inStock}
              />
              <SizeSelector
                selectedSize={tempCardProduct.size}
                sizes={product.sizes}
                onSelectedSize={onSelectedSize}
              />
            </Box>
            {product.inStock === 0 ? (
              <Chip
                label='Producto no disponible'
                color='error'
                variant='outlined'
              />
            ) : (
              <Button
                color='secondary'
                className='circular-btn'
                onClick={onAddToCart}
              >
                {tempCardProduct.size
                  ? "Agregar al carrito"
                  : "Selecione una talla"}
              </Button>
            )}
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
