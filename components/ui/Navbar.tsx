import { useContext, useState } from "react";
import NextLink from "next/link";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
} from "@mui/material";
import {
  ClearOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { NAVBAR_ITEMS } from "../../constants";
import { Logo } from "./Logo";
import { useRouter } from "next/router";
import { UiContext, CartContext } from "../../context";

export const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { pathname, push } = useRouter();
  const { toggleSideMenu } = useContext(UiContext);
  const [shearchTerm, setShearchTerm] = useState("");

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (shearchTerm.trim().length === 0) return;
    setIsSearchVisible(false);
    setShearchTerm("");
    push(`/search/${shearchTerm}`);
  };
  const textFieldInputFocus = (inputRef: any) => {
    if (inputRef && inputRef.node !== null) {
      setTimeout(() => {
        inputRef.focus();
      }, 100);
    }
    return inputRef;
  };

  const checkActiveLink = (path: string) => pathname.includes(path);

  const textFieldProps = { inputRef: textFieldInputFocus };
  return (
    <AppBar>
      <Toolbar>
        <Logo />
        <Box flex={1} />
        <Box
          className='fadeIn'
          sx={{
            display: isSearchVisible
              ? "none"
              : {
                  xs: "none",
                  sm: "block",
                },
          }}
        >
          {NAVBAR_ITEMS.map((item) => (
            <NextLink href={item.path} key={item.path} passHref>
              <Link>
                <Button color={checkActiveLink(item.path) ? "primary" : "info"}>
                  {item.label}
                </Button>
              </Link>
            </NextLink>
          ))}
        </Box>
        <Box flex={1} />

        {/* Pantallas grandes */}
        {isSearchVisible ? (
          <Input
            {...textFieldProps}
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
            }}
            className='fadeIn'
            onKeyPress={({ key }) => key === "Enter" && onSearchTerm()}
            value={shearchTerm}
            onChange={({ target }) => setShearchTerm(target.value)}
            type='text'
            placeholder='Buscar...'
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  onClick={() => {
                    setIsSearchVisible(false);
                    setShearchTerm("");
                  }}
                >
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
            }}
            onClick={() => setIsSearchVisible(true)}
          >
            <SearchOutlined />
          </IconButton>
        )}

        {/* Pantallas pequeñas */}
        <IconButton
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
          }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>
        <NextLink href='/cart' passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={cart.length} color='secondary'>
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>
        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
