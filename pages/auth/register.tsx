import NextLink from "next/link";
import { Button, Grid, TextField, Typography, Link } from "@mui/material";
import { AuthLayout } from "../../components/layouts";
import { TSForm, TSTextField } from "../../components/ui";

interface FormData {
  email: string;
  password: string;
  password2: string;
  completeName: string;
}

const RegisterPage = () => {
  const onSubmit = async (data: FormData) => {
    console.log(data);
  };
  return (
    <AuthLayout title='Registro'>
      <TSForm<FormData>
        form={{ mode: "onChange" }}
        onSubmit={onSubmit}
        noValidate
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
            <TSTextField
              name='completeName'
              label='Nombre completo'
              variant='filled'
              fullWidth
              options={{
                required: "Debes ingresar un nombre completo",
                minLength: {
                  value: 3,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label='Correo' variant='filled' fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TSTextField
              label='Contraseña'
              type='password'
              name='password'
              variant='filled'
              fullWidth
              options={{
                required: "Este campo es requerido",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TSTextField
              label='repetir contraseña'
              type='password'
              name='password2'
              variant='filled'
              fullWidth
              options={{
                required: "Este campo es requerido",
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              color='primary'
              fullWidth
              className='circular-btn'
              size='large'
              type='submit'
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
      </TSForm>
    </AuthLayout>
  );
};

export default RegisterPage;
