import React, { useState, useContext } from "react";
import {
  Box,
  Card,
  Chip,
  Button,
  Typography,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { AuthContext } from "../context/authContext";
import Avatar from "@mui/material/Avatar";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckIcon from "@mui/icons-material/Check";

const AdminLogin: React.FC = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, admin, setAuth, setSelectedCorrector } =
    useContext(AuthContext);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setAuth({
          isAuthenticated: true,
          admin: result.data.name,
          token,
        });
      } else {
        setError(result.err.message);
      }
    } catch (error) {
      setError("Erro na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setSelectedCorrector("");
    setAuth({
      isAuthenticated: false,
      admin: null,
      token: null,
    });
  };

  return (
    <Box width="90%" display="flex" justifyContent="center" alignItems="center">
      <Card sx={{ padding: 4, width: "100%" }}>
        <Typography variant="h5" mb={2}>
          Admin
        </Typography>
        {isAuthenticated ? (
          <Box display="flex" alignItems="center">
            <Chip
              avatar={<Avatar>{admin ? admin.charAt(0) : ""}</Avatar>}
              label={admin}
              sx={{ mr: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<SettingsIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <>
            <TextField
              label="Token"
              variant="outlined"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
              sx={{ mr: 1 }}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Validar"}
            </Button>
          </>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Card>
    </Box>
  );
};

export default AdminLogin;
