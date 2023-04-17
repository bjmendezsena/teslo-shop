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
  ListItemButton,
} from "@mui/material";
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  DashboardOutlined,
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
              <ListItemButton>
                <ListItemIcon>
                  <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary={"Perfil"} />
              </ListItemButton>

              <ListItemButton onClick={() => navigateTo("/orders/history")}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Mis Ordenes"} />
              </ListItemButton>
            </>
          )}

          <ListItemButton sx={{ display: { xs: "", sm: "none" } }}>
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText
              onClick={() => navigateTo("/category/men")}
              primary={"Hombres"}
            />
          </ListItemButton>

          <ListItemButton sx={{ display: { xs: "", sm: "none" } }}>
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText
              onClick={() => navigateTo("/category/women")}
              primary={"Mujeres"}
            />
          </ListItemButton>

          <ListItemButton sx={{ display: { xs: "", sm: "none" } }}>
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText
              onClick={() => navigateTo("/category/kids")}
              primary={"Niños"}
            />
          </ListItemButton>

          {isLoggedIn ? (
            <ListItemButton>
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText onClick={() => logout()} primary={"Salir"} />
            </ListItemButton>
          ) : (
            <ListItemButton>
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText
                onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}
                primary={"Ingresar"}
              />
            </ListItemButton>
          )}

          {user?.role === "admin" && (
            <>
              <Divider />
              <ListSubheader>Admin Panel</ListSubheader>

              <ListItemButton onClick={() => navigateTo("/admin/")}>
                <ListItemIcon>
                  <DashboardOutlined />
                </ListItemIcon>
                <ListItemText primary={"Dashboard"} />
              </ListItemButton>

              <ListItemButton>
                <ListItemIcon>
                  <CategoryOutlined />
                </ListItemIcon>
                <ListItemText primary={"Productos"} />
              </ListItemButton>

              <ListItemButton  onClick={() => navigateTo("/admin/orders")}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Ordenes"} />
              </ListItemButton>

              <ListItemButton onClick={() => navigateTo("/admin/users")}>
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={"Usuarios"} />
              </ListItemButton>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};
