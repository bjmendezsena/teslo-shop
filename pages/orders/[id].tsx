import React, { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import NextLink from "next/link";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { PayPalButtons } from "@paypal/react-paypal-js";

import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Link,
  Chip,
  CircularProgress,
} from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";
import { tesloApi } from "../../api";
import { useRouter } from "next/router";

export type OrderResponseBody = {
  id: string;
  status:
    | "completed"
    | "SAVED"
    | "APPROBED"
    | "VOIDED"
    | "COMPLETED"
    | "PAYER_ACTION_REQUIRED";
};

interface OrderPageProps {
  order: IOrder;
}

const OrderPage: NextPage<OrderPageProps> = ({ order }) => {
  const [isPaing, setIsPaing] = useState(false);
  const router = useRouter();

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("No hay pago en paypal");
    }
    setIsPaing(true);

    try {
      const { data } = await tesloApi.post("/orders/pay", {
        transactionId: details.id,
        orderId: order._id,
      });

      console.log({ data });

      router.reload();
    } catch (error) {
      console.log(error);
      setIsPaing(true);
      alert("Error");
    }
  };

  return (
    <ShopLayout
      title={`Resumen de la orden ${order._id}`}
      pageDescription='Resumen de la orden'
    >
      <Typography variant='h1' component='h1'>
        Orden: {order._id}
      </Typography>

      <Chip
        sx={{
          my: 2,
        }}
        label={order.isPaid ? "Orden ya fue pagada" : "Pendiente de pago"}
        variant='outlined'
        color={order.isPaid ? "success" : "error"}
        icon={
          order.isPaid ? <CreditScoreOutlined /> : <CreditCardOffOutlined />
        }
      />
      <Grid container spacing={2} className='fadeIn'>
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2' component='h2'>
                Resumen ({order.numberOfItems}{" "}
                {order.numberOfItems > 1 ? "productos" : "producto"})
              </Typography>
              <Divider sx={{ my8: 1 }} />
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>
                  Dirección de entrega
                </Typography>
              </Box>

              <Typography>
                {`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}
              </Typography>
              <Typography>
                {order.shippingAddress.address}{" "}
                {order.shippingAddress.address2
                  ? `, ${order.shippingAddress.address2}`
                  : ""}
              </Typography>
              <Typography>
                ` ${order.shippingAddress.city}, ${order.shippingAddress.zip}`
              </Typography>
              <Typography>{order.shippingAddress.country}</Typography>
              <Typography>
                {" "}
                {order.shippingAddress.country} {order.shippingAddress.phone}
              </Typography>
              <Divider sx={{ my8: 1 }} />
              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>
              <OrderSummary
                orderValues={{
                  subTotal: order.subTotal,
                  numberOfItems: order.numberOfItems,
                  tax: order.tax,
                  total: order.total,
                }}
              />
              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  className='fadeIn'
                  sx={{
                    display: isPaing ? "flex" : "none",
                  }}
                >
                  <CircularProgress />
                </Box>
                <Box
                  flexDirection='column'
                  sx={{
                    display: isPaing ? "none" : "flex",
                    flex: 1,
                  }}
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{
                        my: 2,
                      }}
                      label='Orden pagada'
                      variant='outlined'
                      color='success'
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${order.total}`,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          onOrderCompleted(details as OrderResponseBody);
                        });
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;

  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
