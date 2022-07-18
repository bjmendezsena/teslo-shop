import { FC, PropsWithChildren } from "react";
import { Box, Typography } from "@mui/material";
interface Props extends PropsWithChildren {
  description?: string;
}
export const NotFoundComponent: FC<Props> = ({ description, children }) => {
  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      height='calc(100vh - 200px)'
      sx={{
        flexDirection: {
          xs: "column",
          sm: "row",
        },
      }}
    >
      {children || (
        <>
          <Typography
            variant='h1'
            component='h1'
            fontSize={80}
            fontWeight={200}
          >
            404 |
          </Typography>
          <Typography marginLeft={2}>
            {description ? description : "Esta página no existe"}
          </Typography>
        </>
      )}
    </Box>
  );
};
