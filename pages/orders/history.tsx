import { useMemo } from "react";
import { GetServerSideProps, NextPage } from "next";
import { Chip, Grid, Typography, Link } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ShopLayout } from "../../components/layouts";
import NextLink from "next/link";
import { getSession } from "next-auth/react";
import { getOrdersByUserId } from "../../database/dbOrders";
import { IOrder } from "../../interfaces";
interface IRow {
  id: string;
  fullName: string;
  paid: boolean;
}
const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
  },
  {
    field: "fullName",
    headerName: "Nombre completo",
    width: 300,
  },
  {
    field: "paid",
    headerName: "Pagado",
    description: "Muestra inforrmación si está pagada o no",
    width: 200,
    renderCell: (params: GridValueGetterParams<IRow>) => {
      return params.row.paid ? (
        <Chip label='Pagado' color='success' variant='outlined' />
      ) : (
        <Chip label='No pagado' color='error' variant='outlined' />
      );
    },
  },
  {
    field: "orderId",
    headerName: "Ver orden",
    description: "Mira el detalle de la orden",
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams<IRow>) => (
      <NextLink href={`/orders/${params.value}`} passHref>
        <Link underline='always'>Ver orden</Link>
      </NextLink>
    ),
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = useMemo(
    () =>
      orders.map((order, index) => ({
        id: index + 1,
        fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        paid: order.isPaid,
        orderId: order._id,
      })),
    [orders]
  );

  return (
    <ShopLayout
      title='Historial de órdenes'
      pageDescription='Historial de órdenes del cliente'
    >
      <Typography variant='h1' component='h1'>
        Historial de órdenes
      </Typography>
      <Grid container className="fadeIn">
        <Grid
          item
          sx={{
            height: 650,
            width: "100%",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?p=orders/history",
        permanent: false,
      },
    };
  }

  const orders = await getOrdersByUserId(session.user._id);

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;
