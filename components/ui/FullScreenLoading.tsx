import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { NotFoundComponent } from "./NotFoundComponent";

export const FullScreenLoading = () => {
  return (
    <NotFoundComponent>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <Typography
          sx={{
            mb: 3,
          }}
          variant='h2'
          fontWeight={200}
        >
          Cargando...
        </Typography>
        <CircularProgress thickness={2} />
      </Box>
    </NotFoundComponent>
  );
};
