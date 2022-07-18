import { Box, Typography } from "@mui/material";
import { ShopLayout } from "../components/layouts";
import { NotFoundComponent } from "../components/ui";

const Custom404 = () => {
  return (
    <ShopLayout
      title='Page not found'
      pageDescription='No hay nada que mostrar aquí'
    >
      <NotFoundComponent />
    </ShopLayout>
  );
};

export default Custom404;
