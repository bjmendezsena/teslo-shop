import { useContext, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Button, Grid, Typography, Link, Chip } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { AuthLayout } from "../../components/layouts";
import { TSForm, TSTextField } from "../../components/ui";
import { isEmail } from "../../utils";
import { AuthContext } from "../../context";

interface FormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [formStatus, setFormStatus] = useState<"LOADING" | "NONE">("NONE");
  const [showError, setShowError] = useState(false);

  const onSubmit = async ({ email, password }: FormData) => {
    setFormStatus("LOADING");
    setShowError(false);
    const isValidLogin = await login({ email, password });
    if (!isValidLogin) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      setFormStatus("NONE");
      return;
    }
    setFormStatus("NONE");
    const destination = router.query.p?.toString() || "/";
    router.replace(destination);
  };

  const disabled = formStatus === "LOADING";
  return (
    <AuthLayout title='Ingresar'>
      <TSForm<FormData>
        form={{ mode: "onBlur" }}
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
              Iniciar sesión
            </Typography>

            <Chip
              label='Credenciales incorrectas'
              color='error'
              icon={<ErrorOutline />}
              className='fadeIn'
              sx={{
                display: showError ? "flex" : "none",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TSTextField
              label='Correo'
              variant='filled'
              type='email'
              name='email'
              fullWidth
              options={{
                required: "Este campo es requerido",
                validate: isEmail,
              }}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TSTextField
              name='password'
              label='Contraseña'
              type='password'
              variant='filled'
              fullWidth
              options={{
                required: "Este campo es requerido",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              }}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color='primary'
              fullWidth
              className='circular-btn'
              size='large'
              type='submit'
              disabled={disabled}
            >
              Ingresar
            </Button>
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='end'>
            <NextLink
              href={
                router.query.p
                  ? `/auth/register?p=${router.query.p}`
                  : "/auth/register"
              }
              passHref
            >
              <Link underline='always'>¿No tienes cuenta?</Link>
            </NextLink>
          </Grid>
        </Grid>
      </TSForm>
    </AuthLayout>
  );
};

export default LoginPage;
