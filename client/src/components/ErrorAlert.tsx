import React from "react";
import { Alert, AlertTitle } from "@mui/material";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => (
  <Alert severity="error">
    <AlertTitle>Error</AlertTitle>
    {message}
  </Alert>
);

export default ErrorAlert;
