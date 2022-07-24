import { Box, Typography } from "@mui/material";
import type { NextPage, GetServerSideProps } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces";

interface Props {
  products: IProduct[];
  fondProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, fondProducts, query }) => {
  return (
    <ShopLayout
      title={"Teslo-Shop - Search"}
      pageDescription={"Encuentra los mejores productos de teslo aquí"}
      subTitle='Buscar producto'
      description={
        fondProducts ? (
          `Término: ${query.substring(0, 1).toUpperCase()}${query.substring(
            1,
            query.length
          )}`
        ) : (
          <Box display='flex'>
            <Typography
              variant='h2'
              sx={{
                mb: 1,
              }}
            >
              No encontramos ningún producto
            </Typography>
            <Typography
              variant='h2'
              sx={{
                ml: 1,
              }}
              color='secondary'
              textTransform='capitalize'
            >
              {query}
            </Typography>
          </Box>
        )
      }
    >
      <ProductList products={products} />
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };
  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  let products = await dbProducts.getProductsByTerm(query);

  const fondProducts = products.length > 0;

  if (!fondProducts) {
    products = await dbProducts.getProductsByTerm("shirt");
  }

  return {
    props: {
      products,
      query,
      fondProducts,
    },
  };
};

export default SearchPage;
