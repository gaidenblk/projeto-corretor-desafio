import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Typography,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { AuthContext } from "../context/authContext";
import useAuthFetch from "../hooks/useAuthFetch";
import SimpleTable from "./SimpleTable";
import CustomModal from "./CustomModal";

interface Correction {
  id: number;
  correctorId: number;
  class: string;
  module: string;
  meeting: string;
  student: string;
}

const CorrectionsCard: React.FC = () => {
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authFetch = useAuthFetch();
  const { selectedCorrector } = useContext(AuthContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedCorrection, setSelectedCorrection] =
    useState<Correction | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editCorrectionFields, setEditCorrectionFields] = useState<
    Partial<Correction>
  >({
    class: "",
    module: "",
    meeting: "",
    student: "",
  });

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [newCorrection, setNewCorrection] = useState<Partial<Correction>>({
    class: "",
    module: "",
    meeting: "",
    student: "",
  });
  const [loadingAdd, setLoadingAdd] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchCorrections = async () => {
    if (!selectedCorrector) return;
    setLoading(true);
    try {
      const { data, err } = await authFetch(
        `/corrections/${selectedCorrector}`
      );
      if (err) throw new Error(err.message);
      setCorrections(data);
    } catch (err: any) {
      setError(err.message);
      showSnackbar(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCorrection = async () => {
    try {
      setLoadingEdit(true);
      if (!selectedCorrection) return;
      const { data, err } = await authFetch(
        `/corrections/${selectedCorrection.id}`,
        {
          method: "PUT",
          body: JSON.stringify(editCorrectionFields),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (err) throw new Error(err.message);
      const updatedCorrections = corrections.map((correction) =>
        correction.id === data.id ? data : correction
      );
      setCorrections(updatedCorrections);
      setOpenEditModal(false);
      showSnackbar("Correção alterada com sucesso", "success");
    } catch (err: any) {
      setError(err.message);
      showSnackbar(err.message, "error");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDeleteCorrection = async () => {
    try {
      setLoadingDelete(true);
      if (!selectedCorrection) return;
      const { data, err } = await authFetch(
        `/corrections/${selectedCorrection.id}`,
        { method: "DELETE" }
      );
      if (err) throw new Error(err.message);
      setCorrections(
        corrections.filter((correction) => correction.id !== data.id)
      );
      setOpenDeleteModal(false);
      showSnackbar("Correção deletada com sucesso", "success");
    } catch (err: any) {
      setError(err.message);
      showSnackbar(err.message, "error");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleAddCorrection = async () => {
    try {
      setLoadingAdd(true);
      if (
        !selectedCorrector ||
        !newCorrection.class ||
        !newCorrection.module ||
        !newCorrection.meeting ||
        !newCorrection.student
      ) {
        showSnackbar("Todos os campos são obrigatórios", "error");
        setLoadingAdd(false);
        return;
      }

      const { data, err } = await authFetch("/corrections", {
        method: "POST",
        body: JSON.stringify({
          ...newCorrection,
          correctorId: selectedCorrector,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (err) throw new Error(err.message);
      setCorrections([...corrections, data]);
      setOpenAddModal(false);
      showSnackbar("Correção adicionada com sucesso", "success");
    } catch (err: any) {
      setError(err.message);
      showSnackbar(err.message, "error");
    } finally {
      setLoadingAdd(false);
    }
  };

  const openEditModalHandler = (correction: Correction) => {
    setSelectedCorrection(correction);
    setEditCorrectionFields(correction); // Preencher os campos do formulário de edição
    setOpenEditModal(true);
  };

  const openDeleteModalHandler = (correction: Correction) => {
    setSelectedCorrection(correction);
    setOpenDeleteModal(true);
  };

  useEffect(() => {
    fetchCorrections();
  }, [selectedCorrector]);

  return (
    <Card sx={{ padding: 4, width: "90%" }}>
      <Typography variant="h5">Correções</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddTaskIcon />}
        onClick={() => setOpenAddModal(true)}
        sx={{ mt: 2, mb: 2 }}
      >
        Adicionar Nova Correção
      </Button>
      <SimpleTable
        header={["Turma", "Módulo", "Aula", "Aluno (a)", "Ações"]}
        content={
          loading ? (
            <CircularProgress sx={{ mt: 2 }} />
          ) : corrections.length === 0 ? (
            "Sem Correções"
          ) : (
            corrections
          )
        }
        onEdit={openEditModalHandler}
        onDelete={openDeleteModalHandler}
      />

      <CustomModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title="Editar Correção"
        content={
          <form>
            <TextField
              label="Turma"
              value={editCorrectionFields.class}
              onChange={(e) =>
                setEditCorrectionFields({
                  ...editCorrectionFields,
                  class: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Módulo"
              value={editCorrectionFields.module}
              onChange={(e) =>
                setEditCorrectionFields({
                  ...editCorrectionFields,
                  module: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Aula"
              value={editCorrectionFields.meeting}
              onChange={(e) =>
                setEditCorrectionFields({
                  ...editCorrectionFields,
                  meeting: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Aluno (a)"
              value={editCorrectionFields.student}
              onChange={(e) =>
                setEditCorrectionFields({
                  ...editCorrectionFields,
                  student: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
          </form>
        }
        confirmText="Salvar"
        onConfirm={handleEditCorrection}
        loading={loadingEdit}
      />

      <CustomModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Confirmar Exclusão"
        content={
          <Typography>
            Tem certeza que deseja excluir esta correção? Esta ação não pode ser
            desfeita.
          </Typography>
        }
        confirmText="Excluir"
        onConfirm={handleDeleteCorrection}
        loading={loadingDelete}
      />

      <CustomModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        title="Adicionar Nova Correção"
        content={
          <>
            <TextField
              label="Turma"
              value={newCorrection.class}
              onChange={(e) =>
                setNewCorrection({ ...newCorrection, class: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Módulo"
              value={newCorrection.module}
              onChange={(e) =>
                setNewCorrection({ ...newCorrection, module: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Aula"
              value={newCorrection.meeting}
              onChange={(e) =>
                setNewCorrection({ ...newCorrection, meeting: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Aluno (a)"
              value={newCorrection.student}
              onChange={(e) =>
                setNewCorrection({ ...newCorrection, student: e.target.value })
              }
              fullWidth
              margin="normal"
            />
          </>
        }
        confirmText="Adicionar"
        onConfirm={handleAddCorrection}
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

export default CorrectionsCard;
