import { useContext } from "react";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
} from "@mui/material";
import { Logo } from "../ui";
import { UiContext } from "../../context";

export const AdminNavbar = () => {


  const { toggleSideMenu } = useContext(UiContext);


  return (
    <AppBar>
        
      <Toolbar>
        <Logo />
        <Box flex={1} />

        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
