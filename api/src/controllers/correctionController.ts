import { Request, Response } from "express";
import pool from "../database";
import { Correction } from "../models/correction";

export const getCorrections = async (req: Request, res: Response) => {
  try {
    const correctorId: any = req.params.correctorId;
    if (isNaN(correctorId)) {
      res
        .status(400)
        .json({ data: null, err: { message: "Corretor inválido" } });
      return;
    }

    const existent = await pool.query(
      "SELECT * FROM correctors WHERE id = $1",
      [correctorId]
    );

    if (existent.rowCount! === 0) {
      res
        .status(404)
        .json({ data: null, err: { message: "Corretor não encontrado" } });
      return;
    }

    const result = await pool.query(
      `SELECT * FROM corrections WHERE "correctorId" = $1`,
      [correctorId]
    );
    const corrections: Correction[] = result.rows;
    res.json({ data: corrections, err: null });
  } catch (error) {
    res
      .status(500)
      .json({ data: null, err: { message: "Internal Server Error" } });
  }
};

export const createCorrection = async (req: Request, res: Response) => {
  try {
    const {
      correctorId,
      class: className,
      module,
      meeting,
      student,
    } = req.body;

    const existent = await pool.query(
      "SELECT * FROM correctors WHERE id = $1",
      [correctorId]
    );

    if (existent.rowCount! === 0) {
      res
        .status(404)
        .json({ data: null, err: { message: "O Id fornecido não existe" } });
      return;
    }

    if (!correctorId) {
      res
        .status(400)
        .json({ data: null, err: { message: "Corretor não informado" } });
      return;
    }

    if (!className) {
      res
        .status(400)
        .json({ data: null, err: { message: "Turma não informada" } });
      return;
    }

    if (!module) {
      res
        .status(400)
        .json({ data: null, err: { message: "Módulo não informado" } });
      return;
    }

    if (!meeting) {
      res
        .status(400)
        .json({ data: null, err: { message: "Aula não informada" } });
      return;
    }

    if (!student) {
      res
        .status(400)
        .json({ data: null, err: { message: "Aluno não informado" } });
      return;
    }

    const result = await pool.query(
      `INSERT INTO corrections ("correctorId", class, module, meeting, student) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [correctorId, className, module, meeting, student]
    );

    const newCorrection: Correction = result.rows[0];
    res.status(201).json({ data: newCorrection, err: null });
  } catch (error) {
    res
      .status(500)
      .json({ data: null, err: { message: "Internal Server Error" } });
  }
};

export const updateCorrection = async (req: Request, res: Response) => {
  try {
    const {
      correctorId,
      class: className,
      module,
      meeting,
      student,
    } = req.body;
    const correctionId: any = req.params.correctionId;

    if (isNaN(correctionId)) {
      res
        .status(400)
        .json({ data: null, err: { message: "Correção inválida" } });
      return;
    }

    const existent = await pool.query(
      "SELECT * FROM correctors WHERE id = $1",
      [correctorId]
    );

    if (existent.rowCount! === 0) {
      res
        .status(404)
        .json({ data: null, err: { message: "O Id fornecido não existe" } });
      return;
    }

    if (!correctorId) {
      res
        .status(400)
        .json({ data: null, err: { message: "Corretor não informado" } });
      return;
    }

    if (!className) {
      res
        .status(400)
        .json({ data: null, err: { message: "Turma não informada" } });
      return;
    }

    if (!module) {
      res
        .status(400)
        .json({ data: null, err: { message: "Módulo não informado" } });
      return;
    }

    if (!meeting) {
      res
        .status(400)
        .json({ data: null, err: { message: "Aula não informada" } });
      return;
    }

    if (!student) {
      res
        .status(400)
        .json({ data: null, err: { message: "Aluno não informado" } });
      return;
    }

    const verifyCorrector = await pool.query(
      `SELECT "correctorId" FROM corrections WHERE id = $1`,
      [correctionId]
    );

    if (verifyCorrector.rows.length === 0) {
      res.status(404).json({
        data: null,
        err: { message: "Correção não encontrada" },
      });
      return;
    }

    if (correctorId !== verifyCorrector.rows[0].correctorId) {
      res.status(400).json({
        data: null,
        err: { message: "Corretor não pode ser alterado" },
      });
      return;
    }

    const result = await pool.query(
      "UPDATE corrections SET class = $1, module = $2, meeting = $3, student = $4 WHERE id = $5 RETURNING *",
      [className, module, meeting, student, correctionId]
    );
    const updatedCorrection: Correction = result.rows[0];
    res.json({ data: updatedCorrection, err: null });
  } catch (error) {
    res
      .status(500)
      .json({ data: null, err: { message: "Internal Server Error" } });
  }
};

export const deleteCorrection = async (req: Request, res: Response) => {
  try {
    const correctionId: any = req.params.correctionId;

    if (isNaN(correctionId)) {
      res
        .status(400)
        .json({ data: null, err: { message: "Correção inválida" } });
      return;
    }

    const result = await pool.query(
      "DELETE FROM corrections WHERE id = $1 RETURNING *",
      [correctionId]
    );
    const deletedCorrection: Correction = result.rows[0];
    if (deletedCorrection) {
      res.json({ data: deletedCorrection, err: null });
    } else {
      res
        .status(404)
        .json({ data: null, err: { message: "Correção não encontrada" } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ data: null, err: { message: "Internal Server Error" } });
  }
};
