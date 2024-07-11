import React from "react";
import { CssBaseline, Box } from "@mui/material";
import { AuthProvider } from "./context/authContext";
import MenuBar from "./components/MenuBar";
import MainContent from "./components/MainContent";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CssBaseline />
      <MenuBar />
      <Box display="block" padding={2}>
        <MainContent />
      </Box>
    </AuthProvider>
  );
};

export default App;
