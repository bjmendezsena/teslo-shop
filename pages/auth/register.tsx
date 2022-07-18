import NextLink from "next/link";
import { Box, Button, Grid, TextField, Typography, Link } from "@mui/material";
import { AuthLayout } from "../../components/layouts";

const RegisterPage = () => {
  return (
    <AuthLayout title='Registro'>
      <Box
        display='flex'
        sx={{
          width: 350,
          padding: "10px 20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          container
          spacing={2}
          style={{
            height: "min-content",
          }}
        >
          <Grid item xs={12}>
            <Typography variant='h1' component='h1'>
              Crear cuenta
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField label='Nombre completo' variant='filled' fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label='Correo' variant='filled' fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Contraseña'
              type='password'
              variant='filled'
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='repetir contraseña'
              type='password'
              variant='filled'
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color='primary'
              fullWidth
              className='circular-btn'
              size='large'
            >
              Registrarse
            </Button>
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='end'>
            <NextLink href='/auth/login' passHref>
              <Link underline='always'>Ya tienes tienes cuenta?</Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;
