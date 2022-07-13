import { Box, Drawer, Input, List, ListItem } from "@mui/material";
import React from "react";

export const SideMenu = () => {
  return <Drawer open={true} anchor='right'
  sx={{
  }}
  >
    <Box>
        <List>
            <ListItem>
                <Input placeholder='Search' />
            </ListItem>
        </List>
    </Box>
  </Drawer>;
};
