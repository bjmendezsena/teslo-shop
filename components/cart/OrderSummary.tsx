import { Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { CartContext } from "../../context";
import { formatCurrency } from "../../utils";

export const OrderSummary = () => {
  const { numberOfItems, subTotal, tax, total } = useContext(CartContext);
  const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * 100;
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>
          {numberOfItems} {numberOfItems > 1 ? "productos" : "producto"}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{formatCurrency(subTotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>IVA ({taxRate})%</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{formatCurrency(tax)}</Typography>
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
        <Typography variant='subtitle1'>{formatCurrency(total)}</Typography>
      </Grid>
    </Grid>
  );
};
