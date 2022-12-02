import { useContext, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  EscalatorWarningOutlined,
  FemaleOutlined,
  LoginOutlined,
  MaleOutlined,
  SearchOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import { UiContext, useAuthContext } from "../../context";
import { useRouter } from "next/router";

export const SideMenu = () => {
  const router = useRouter();
  const { user, logout, isLoggedIn } = useAuthContext();
  const { isMenuOpened, toggleSideMenu } = useContext(UiContext);

  const [shearchTerm, setShearchTerm] = useState("");

  const onSearchTerm = () => {
    if (shearchTerm.trim().length === 0) return;
    setShearchTerm("");
    navigateTo(`/search/${shearchTerm}`);
  };

  const navigateTo = (path: string) => {
    toggleSideMenu();

    router.push(path);
  };
  const textFieldInputFocus = (inputRef: any) => {
    if (inputRef && inputRef.node !== null) {
      setTimeout(() => {
        inputRef.focus();
      }, 100);
    }
    return inputRef;
  };


  const textFieldProps = { inputRef: textFieldInputFocus };

  return (
    <Drawer
      open={isMenuOpened}
      onClose={toggleSideMenu}
      anchor='right'
      sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              {...textFieldProps}
              onKeyPress={({ key }) => key === "Enter" && onSearchTerm()}
              value={shearchTerm}
              onChange={({ target }) => setShearchTerm(target.value)}
              type='text'
              placeholder='Buscar...'
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={onSearchTerm}>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          {isLoggedIn && (
            <>
              <ListItem button>
                <ListItemIcon>
                  <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary={"Perfil"} />
              </ListItem>

              <ListItem button>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Mis Ordenes"} />
              </ListItem>
            </>
          )}

          <ListItem button sx={{ display: { xs: "", sm: "none" } }}>
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText
              onClick={() => navigateTo("/category/men")}
              primary={"Hombres"}
            />
          </ListItem>

          <ListItem button sx={{ display: { xs: "", sm: "none" } }}>
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText
              onClick={() => navigateTo("/category/women")}
              primary={"Mujeres"}
            />
          </ListItem>

          <ListItem button sx={{ display: { xs: "", sm: "none" } }}>
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText
              onClick={() => navigateTo("/category/kids")}
              primary={"Niños"}
            />
          </ListItem>

          {isLoggedIn ? (
            <ListItem button>
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText onClick={() => logout()} primary={"Salir"} />
            </ListItem>
          ) : (
            <ListItem button>
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText
                onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}
                primary={"Ingresar"}
              />
            </ListItem>
          )}

          {user?.role === "admin" && (
            <>
              <Divider />
              <ListSubheader>Admin Panel</ListSubheader>

              <ListItem button>
                <ListItemIcon>
                  <CategoryOutlined />
                </ListItemIcon>
                <ListItemText primary={"Productos"} />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Ordenes"} />
              </ListItem>

              <ListItem button>
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={"Usuarios"} />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};
