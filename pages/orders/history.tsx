import { Chip, Grid, Typography, Link } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ShopLayout } from "../../components/layouts";
import NextLink from "next/link";
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
    field: "orden",
    headerName: "Ver orden",
    description: "Mira el detalle de la orden",
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams<IRow>) => (
      <NextLink href={`/orders/${params.row.id}`} passHref>
        <Link underline='always'>Ver orden</Link>
      </NextLink>
    ),
  },
];
const rows: IRow[] = [
  {
    id: "1",
    fullName: "Lewis Mendez",
    paid: true,
  },
  {
    id: "2",
    fullName: "Lewis Mendez",
    paid: false,
  },
  {
    id: "3",
    fullName: "Lewis Mendez",
    paid: true,
  },
  {
    id: "4",
    fullName: "Lewis Mendez",
    paid: true,
  },
  {
    id: "5",
    fullName: "Lewis Mendez",
    paid: false,
  },
];

const HistoryPage = () => {
  return (
    <ShopLayout
      title='Historial de órdenes'
      pageDescription='Historial de órdenes del cliente'
    >
      <Typography variant='h1' component='h1'>
        Historial de órdenes
      </Typography>
      <Grid container>
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

export default HistoryPage;
