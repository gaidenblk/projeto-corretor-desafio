import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  confirmText: string;
  onConfirm: () => void;
  loading?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  content,
  confirmText,
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxWidth: 400,
          minWidth: 300,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        {content}
        <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={onConfirm}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {confirmText}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CustomModal;
