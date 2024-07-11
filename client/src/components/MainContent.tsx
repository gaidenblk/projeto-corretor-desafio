import React, { useContext } from "react";
import { Box } from "@mui/material";
import CorrectorsCard from "./CorrectorsCard";
import CorrectionsCard from "./CorrectionsCard";
import AdminLogin from "./AdminLogin";
import { AuthContext } from "../context/authContext";

const MainContent: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <AdminLogin />
        <CorrectorsCard />
        <CorrectionsCard />
      </Box>
    </>
  );
};

export default MainContent;
