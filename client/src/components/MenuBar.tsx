import React from "react";
import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";

const MenuBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center">
          <Avatar src="/image.png" alt="CorreThor" sx={{ mr: 2 }} />
          <Typography variant="h6">CorreThor</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
