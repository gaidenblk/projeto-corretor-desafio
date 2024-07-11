import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

interface ITableProps {
  header: string[];
  content: Correction[] | string | JSX.Element; // Definindo content como union type
  onEdit?: (item: Correction) => void; // Adicionando a prop onEdit
  onDelete?: (item: Correction) => void; // Adicionando a prop onDelete
}

interface Correction {
  id: number;
  correctorId: number;
  class: string;
  module: string;
  meeting: string;
  student: string;
}

const SimpleTable = (props: ITableProps) => {
  // Convertendo content para um array de Correction[] ou mantendo como string/JSX.Element
  const rows: Correction[] = Array.isArray(props.content) ? props.content : [];

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            {props.header.map((item) => (
              <TableCell key={item}>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Verifica se content não é um array de objetos */}
          {Array.isArray(props.content) ? (
            rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={props.header.length + 1}>
                  Sem Correções
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.class}</TableCell>
                  <TableCell>{row.module}</TableCell>
                  <TableCell>{row.meeting}</TableCell>
                  <TableCell>{row.student}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<ModeEditIcon />}
                      onClick={() => props.onEdit && props.onEdit(row)}
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => props.onDelete && props.onDelete(row)}
                    >
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )
          ) : (
            // Se não for um array de objetos, renderiza diretamente como um único TableCell
            <TableRow>
              <TableCell colSpan={props.header.length + 1}>
                {props.content}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default SimpleTable;
