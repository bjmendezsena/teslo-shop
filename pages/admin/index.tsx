import React from "react";
import { AdminLayout } from "../../components/layouts";
import {
  DashboardOutlined,
  CreditCardOffOutlined,
  AttachMoneyOutlined,
  GroupOutlined,
  CategoryOutlined,
  CancelPresentationOutlined,
  ProductionQuantityLimitsOutlined,
  AccessTimeOutlined,
} from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { SummaryTile } from "../../components/admin";
import useSWR from "swr";
import { DashboardSumarryResponse } from "../../interfaces";

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSumarryResponse>(
    "/api/admin/dashboard",
    {
      refreshInterval: 30 * 1000,
    }
  );

  const [refreshIn, setRefreshIn] = React.useState(30);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!error && !data) return <></>;

  if (error) {
    console.log(error);
    return <Typography variant='h4'>Error al cargar los datos</Typography>;
  }

  const {
    numberOfOrders,
    numberOfClients,
    numberOfProducts,
    paidOrders,
    notPaidOrders,
    productsWithNotInventory,
    lowInventoryProducts,
  } = data!;

  return (
    <AdminLayout
      title='Dashboard'
      subTitle='Estadísticas generales'
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subtitle='Ordenes totales'
          icon={<CreditCardOffOutlined color='secondary' />}
        />
        <SummaryTile
          title={paidOrders}
          subtitle='Ordenes pagadas'
          icon={<AttachMoneyOutlined color='success' />}
        />
        <SummaryTile
          title={notPaidOrders}
          subtitle='Ordenes pendientes'
          icon={<CreditCardOffOutlined color='error' />}
        />
        <SummaryTile
          title={numberOfClients}
          subtitle='Clientes'
          icon={<GroupOutlined color='primary' />}
        />
        <SummaryTile
          title={numberOfProducts}
          subtitle='Productos'
          icon={<CategoryOutlined color='warning' />}
        />
        <SummaryTile
          title={productsWithNotInventory}
          subtitle='Sin existencias'
          icon={<CancelPresentationOutlined color='error' />}
        />
        <SummaryTile
          title={lowInventoryProducts}
          subtitle='Bajo inventario'
          icon={<ProductionQuantityLimitsOutlined color='warning' />}
        />
        <SummaryTile
          title={refreshIn}
          subtitle='Actualización en:'
          icon={<AccessTimeOutlined color='secondary' />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
