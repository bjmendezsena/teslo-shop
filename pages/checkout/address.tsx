import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { ShopLayout } from "../../components/layouts/ShopLayout";

const AddressPage = () => {
  return (
    <ShopLayout
      title='Dirección'
      pageDescription='Confirmar dirección del destino'
    >
      <Typography variant='h1'>Dirección</Typography>
      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
        }}
      >
        <Grid item xs={12} sm={6}>
          <TextField
            label='Nombre'
            variant='filled'
            fullWidth
            style={{
              borderRadius: "5px",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Apellidos'
            variant='filled'
            fullWidth
            style={{
              borderRadius: "5px",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Dirección'
            variant='filled'
            fullWidth
            style={{
              borderRadius: "5px",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Dirección 2'
            variant='filled'
            fullWidth
            style={{
              borderRadius: "5px",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Código postal'
            variant='filled'
            fullWidth
            style={{
              borderRadius: "5px",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Ciudad'
            variant='filled'
            fullWidth
            style={{
              borderRadius: "5px",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Select variant='filled' label='País' value={1}>
              <MenuItem value={1}>Rep. Dom</MenuItem>
              <MenuItem value={2}>España</MenuItem>
              <MenuItem value={3}>Colombia</MenuItem>
              <MenuItem value={4}>Bolivia</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Teléfono'
            variant='filled'
            fullWidth
            style={{
              borderRadius: "5px",
            }}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          mt: 5,
        }}
        display='flex'
        justifyContent='center'
      >
        <Button color='secondary' className='circular-btn' size='large'>
          Revisar pedido
        </Button>
      </Box>
    </ShopLayout>
  );
};

export default AddressPage;
