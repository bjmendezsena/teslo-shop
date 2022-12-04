import { useContext, useState, useEffect } from "react";
import {GetServerSideProps} from "next";
import { signIn, getSession } from "next-auth/react";
import NextLink from "next/link";
import { Button, Grid, Typography, Link, Chip } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { AuthLayout } from "../../components/layouts";
import { TSForm, TSTextField } from "../../components/ui";
import { isEmail } from "../../utils";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context";
import { useRouter } from "next/router";

interface FormData {
  email: string;
  password: string;
  password2: string;
  name: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const methods = useForm<FormData>({
    mode: "onChange",
  });
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setRegisterError(null);
    const { hasError, message } = await registerUser(formData);
    if (hasError) {
      setRegisterError(message!);
      setTimeout(() => setRegisterError(null), 3000);
      return setIsLoading(false);
    }
    // const destination = router.query.p?.toString() || "/";
    // router.replace(destination);
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
    });
    setIsLoading(false);
  };

  return (
    <AuthLayout title='Registro'>
      <TSForm<FormData>
        methods={methods}
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
            <Chip
              label={registerError}
              color='error'
              icon={<ErrorOutline />}
              className='fadeIn'
              sx={{
                display: registerError ? "flex" : "none",
                justifyContent: "center",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TSTextField
              name='name'
              label='Nombre completo'
              variant='filled'
              fullWidth
              disabled={isLoading}
              options={{
                required: "Debes ingresar un nombre completo",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 carácteres",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TSTextField
              label='Correo'
              variant='filled'
              type='email'
              name='email'
              disabled={isLoading}
              fullWidth
              options={{
                required: "Este campo es requerido",
                validate: isEmail,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TSTextField
              label='Contraseña'
              type='password'
              name='password'
              variant='filled'
              disabled={isLoading}
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
              disabled={isLoading}
              fullWidth
              options={{
                required: "Este campo es requerido",
                validate: (value) => {
                  if (value !== methods.watch("password")) {
                    return "Las contraseñas no coinciden";
                  }
                },
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
              disabled={isLoading || !methods.formState.isValid}
              sx={{
                ":disabled": {
                  color: "white",
                },
              }}
            >
              Registrarse
            </Button>
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='end'>
            <NextLink
              href={
                router.query.p
                  ? `/auth/login?p=${router.query.p}`
                  : "/auth/login"
              }
              passHref
            >
              <Link underline='always'>Ya tienes tienes cuenta?</Link>
            </NextLink>
          </Grid>
        </Grid>
      </TSForm>
    </AuthLayout>
  );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, query } = context;
  const session = await getSession({ req });

  const {p = '/'} = query;
  
  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      }
    }
  }

  return {
    props: {},
  };
}


export default RegisterPage;
