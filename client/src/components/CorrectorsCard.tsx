import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { AuthContext } from "../context/authContext";
import useAuthFetch from "../hooks/useAuthFetch";
import { SelectChangeEvent } from "@mui/material/Select";
import { Edit, Delete, PersonAddAlt } from "@mui/icons-material";
import CustomModal from "./CustomModal";

const CorrectorsCard: React.FC = () => {
  const [correctors, setCorrectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCorrector, setSelectedCorrector } = useContext(AuthContext);
  const authFetch = useAuthFetch();
  const [newCorrectorName, setNewCorrectorName] = useState<string>("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [addCorrectorName, setAddCorrectorName] = useState<string>("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchCorrectors = async () => {
      try {
        const { data, err } = await authFetch("/correctors");
        if (err) throw new Error(err.message);
        setCorrectors(data);
      } catch (err: any) {
        setError(err.message);
        showSnackbar(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCorrectors();
  }, []);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedCorrector(event.target.value);
  };

  const handleNameUpdate = async () => {
    try {
      setLoadingEdit(true);
      const { data, err } = await authFetch(
        `/correctors/${selectedCorrector}`,
        {
          method: "PUT",
          body: JSON.stringify({ name: newCorrectorName }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (err) throw new Error(err.message);
      const updatedCorrectors = correctors.map((corrector) =>
        corrector.id === data.id ? data : corrector
      );
      setCorrectors(updatedCorrectors);
      setOpenEditModal(false);
      showSnackbar("Nome do corretor atualizado com sucesso", "success");
    } catch (err: any) {
      setError(err.message);
      showSnackbar(err.message, "error");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoadingDelete(true);
      const { data, err } = await authFetch(
        `/correctors/${selectedCorrector}`,
        { method: "DELETE" }
      );
      if (err) throw new Error(err.message);

      const updatedCorrectors = correctors.filter(
        (corrector) => corrector.id !== data.id
      );
      setCorrectors(updatedCorrectors);

      // Definir o novo selectedCorrector
      if (updatedCorrectors.length > 0) {
        setSelectedCorrector(
          updatedCorrectors[updatedCorrectors.length - 1].id
        ); // Seleciona o último corretor da lista
      } else {
        setSelectedCorrector(null); // Se não houver mais corretores, deseleciona
      }

      setOpenDeleteModal(false);
      showSnackbar("Corretor deletado com sucesso", "success");
    } catch (err: any) {
      setError(err.message);
      showSnackbar(err.message, "error");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleAddCorrector = async () => {
    try {
      setLoadingAdd(true);
      const { data, err } = await authFetch("/correctors", {
        method: "POST",
        body: JSON.stringify({ name: addCorrectorName }),
        headers: { "Content-Type": "application/json" },
      });
      if (err) throw new Error(err.message);
      setCorrectors([...correctors, data]);
      setOpenAddModal(false);
      setAddCorrectorName("");
      showSnackbar("Corretor adicionado com sucesso", "success");
    } catch (err: any) {
      setError(err.message);
      showSnackbar(err.message, "error");
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <Card
      sx={{ padding: 4, width: "90%", marginTop: "15px", marginBottom: "15px" }}
    >
      <Typography marginBottom="10px" variant="h5">
        Corretores
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddAlt />}
              onClick={() => setOpenAddModal(true)}
            >
              Adicionar Corretor
            </Button>
          </Grid>
          <Grid item>
            <Select
              style={{ minWidth: "150px", height: "40px" }}
              value={selectedCorrector || ""}
              onChange={handleSelectChange}
              placeholder="Corretor(a)"
            >
              {correctors.map((corrector) => (
                <MenuItem key={corrector.id} value={corrector.id}>
                  {corrector.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={() => setOpenEditModal(true)}
              disabled={!selectedCorrector}
            >
              Alterar Nome
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Delete />}
              onClick={() => setOpenDeleteModal(true)}
              disabled={!selectedCorrector}
            >
              Deletar Corretor
            </Button>
          </Grid>
        </Grid>
      )}

      <CustomModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title="Editar Nome do Corretor"
        content={
          <TextField
            label="Novo Nome"
            value={newCorrectorName}
            onChange={(e) => setNewCorrectorName(e.target.value)}
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mt: 2 }}
          />
        }
        confirmText="Confirmar"
        onConfirm={handleNameUpdate}
        loading={loadingEdit}
      />

      <CustomModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Confirmar Exclusão"
        content={
          <Typography>
            Tem certeza que deseja excluir este corretor? Esta ação não pode ser
            desfeita.
          </Typography>
        }
        confirmText="Excluir"
        onConfirm={handleDeleteConfirm}
        loading={loadingDelete}
      />

      <CustomModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        title="Adicionar Corretor"
        content={
          <TextField
            label="Nome do Corretor"
            value={addCorrectorName}
            onChange={(e) => setAddCorrectorName(e.target.value)}
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mt: 2 }}
          />
        }
        confirmText="Adicionar"
        onConfirm={handleAddCorrector}
        loading={loadingAdd}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default CorrectorsCard;
