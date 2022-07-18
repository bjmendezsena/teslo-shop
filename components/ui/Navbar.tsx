import NextLink from "next/link";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { NAVBAR_ITEMS } from "../../constants";
import { Logo } from "./Logo";

export const Navbar = () => {
  return (
    <AppBar>
      <Toolbar>
        <Logo />
        <Box flex={1} />
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >
          {NAVBAR_ITEMS.map((item) => (
            <NextLink href={item.path} key={item.path} passHref>
              <Link>
                <Button>{item.label}</Button>
              </Link>
            </NextLink>
          ))}
        </Box>
        <Box flex={1} />

        <IconButton>
          <SearchOutlined />
        </IconButton>
        <NextLink href='/cart' passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={2} color='secondary'>
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>
        <Button>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
