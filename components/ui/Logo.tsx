import { Typography, Link } from "@mui/material";
import NextLink from "next/link";

export const Logo = () => {
  return (
    <NextLink href='/' passHref>
      <Link display='flex' alignItems='center'>
        <Typography variant='h6'>Teslo |</Typography>
        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
      </Link>
    </NextLink>
  );
};
