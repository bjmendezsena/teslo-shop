import { useContext, FC } from "react";
import { Grid, Typography } from "@mui/material";
import { CartContext } from "../../context";
import { formatCurrency } from "../../utils";

interface OrderSummaryProps {
  orderValues?: {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
  };
}

export const OrderSummary: FC<OrderSummaryProps> = ({ orderValues }) => {
  const { numberOfItems, subTotal, tax, total } = useContext(CartContext);
  const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * 100;

  const summaryValues = orderValues || { numberOfItems, subTotal, tax, total };
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>
          {summaryValues.numberOfItems} {summaryValues.numberOfItems > 1 ? "productos" : "producto"}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{formatCurrency(summaryValues.subTotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>IVA ({taxRate})%</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{formatCurrency(summaryValues.tax)}</Typography>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          mt: 2,
        }}
      >
        <Typography variant='subtitle1'>Total:</Typography>
      </Grid>
      <Grid
        item
        xs={6}
        display='flex'
        justifyContent='end'
        sx={{
          mt: 2,
        }}
      >
        <Typography variant='subtitle1'>{formatCurrency(summaryValues.total)}</Typography>
      </Grid>
    </Grid>
  );
};
