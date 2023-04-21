import React from "react";
import { AdminLayout } from "../../../components/layouts";
import { AddOutlined, ConfirmationNumberOutlined } from "@mui/icons-material";
import { CardMedia, Grid, Typography, Link, Box, Button } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import useSWR from "swr";
import { IProduct } from "../../../interfaces";
import NextLink from "next/link";
import { tesloApi } from "../../../api";

const columns: GridColDef[] = [
  {
    field: "img",
    headerName: "Foto",
    renderCell(params: GridValueGetterParams) {
      return (
        <a
          href={`/product/${params.row.slug}`}
          target='_blank'
          rel='noreferrer'
          style={{
            padding: "0.5rem",
          }}
        >
          <CardMedia
            component='img'
            alt={params.row.title}
            className='fadeIn'
            image={params.value}
          />
        </a>
      );
    },
  },
  {
    field: "title",
    headerName: "Título",
    width: 250,
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref>
          <Link underline='always'>{row.title}</Link>
        </NextLink>
      );
    },
  },
  { field: "gender", headerName: "Género" },
  { field: "type", headerName: "Tipo" },
  { field: "inStock", headerName: "Inventario" },
  { field: "price", headerName: "Precio" },
  {
    field: "sizes",
    headerName: "Tallas",
    width: 200,
  },
];

const ProductsPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { data, error } = useSWR<IProduct[]>("/api/admin/products");

  if (!error && !data) return <></>;

  if (error)
    return <Typography variant='h4'>Error al cargar los datos</Typography>;

  const rows = data!.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(", "),
    slug: product.slug,
  }));

  const onDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const { data } = await tesloApi({
        url: `/api/admin/products/${id}`,
        method: "DELETE",
      })
      console.log({ data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout
      title={`Productos (${data!.length})`}
      subTitle='Mantenimiento de ordenes'
      icon={<ConfirmationNumberOutlined />}
    >
      <Box
        display='flex'
        justifyContent='end'
        sx={{
          mb: 2,
        }}
      >
        <Button
          startIcon={<AddOutlined />}
          color='secondary'
          href='/admin/products/new'
          sx={{
            height: 40,
          }}
        >
          Crear producto
        </Button>
      </Box>
      <Grid container className='fadeIn'>
        <Grid
          item
          sx={{
            height: 650,
            width: "100%",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns.concat({
              field: "id",
              headerName: "Acciones",
              width: 200,
              renderCell: ({ row }: GridValueGetterParams) => {
                return (
                  <Box
                    display='flex'
                    justifyContent='space-around'
                    alignItems='center'
                    width='100%'
                  >
                    <NextLink href={`/admin/products/${row.slug}`} passHref>
                      <Link underline='always'>Editar</Link>
                    </NextLink>
                    <Button
                      onClick={() => onDelete(row.id as string)}
                      color='error'
                      disabled={isLoading}
                    >
                      Borrar
                    </Button>
                  </Box>
                );
              },
            })}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
