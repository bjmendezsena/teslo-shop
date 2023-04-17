import React from "react";
import { AdminLayout } from "../../../components/layouts";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import useSWR from "swr";
import { IOrder, IUser } from "../../../interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "Orden ID", width: 250 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "name", headerName: "Nombre", width: 300 },
  { field: "Total", headerName: "Total", width: 150 },
  {
    field: "isPaid",
    headerName: "Pagado",
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid ? (
        <Chip label='Pagado' color='success' variant='outlined' />
      ) : (
        <Chip label='Pendiente' color='error' variant='outlined' />
      );
    },
  },
  { field: "noProducts", headerName: "No. Productos", align: "center", width: 150 },
  {
    field: "check",
    headerName: "Ver orden",
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>
          Ver orden
        </a>
      );
    },
  },
  { field: "createdAt", headerName: "Creada en" , width: 300},
];

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>("/api/admin/orders");

  if (!error && !data) return <></>;

  if (error)
    return <Typography variant='h4'>Error al cargar los datos</Typography>;

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    Total: `${order.total} €`,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout
      title='Orders'
      subTitle='Mantenimiento de ordenes'
      icon={<ConfirmationNumberOutlined />}
    >
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
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
