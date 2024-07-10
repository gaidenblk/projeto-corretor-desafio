import { Request, Response } from "express";
import pool from "../database";
import { Corrector } from "../models/corrector";

export const getCorrectors = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM correctors");
    const correctors: Corrector[] = result.rows;
    res.json({ data: correctors, err: null });
  } catch (error) {
    res
      .status(500)
      .json({ data: null, err: { message: "Internal Server Error" } });
  }
};

export const getCorrectorById = async (req: Request, res: Response) => {
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

    const result = await pool.query("SELECT * FROM correctors WHERE id = $1", [
      correctorId,
    ]);
    const corrector: Corrector = result.rows[0];
    if (corrector) {
      res.json({ data: corrector, err: null });
    } else {
      res
        .status(404)
        .json({ data: null, err: { message: "Corretor não encontrado" } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ data: null, err: { message: "Internal Server Error" } });
  }
};

export const createCorrector = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        data: null,
        err: { message: "Nome do corretor não informado" },
      });
      return;
    }

    const existent = await pool.query(
      "SELECT * FROM correctors WHERE name = $1",
      [name]
    );

    if (existent.rowCount! > 0) {
      res.status(409).json({
        data: null,
        err: { message: "Já há um corretor com esse nome cadastrado" },
      });
      return;
    }

    const result = await pool.query(
      "INSERT INTO correctors (name) VALUES ($1) RETURNING *",
      [name]
    );
    const newCorrector: Corrector = result.rows[0];
    res.status(201).json({ data: newCorrector, err: null });
  } catch (error) {
    res
      .status(500)
      .json({ data: null, err: { message: "Internal Server Error" } });
  }
};

export const updateCorrector = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const correctorId: any = req.params.correctorId;

    if (!name) {
      res.status(400).json({
        data: null,
        err: { message: "Nome do corretor não informado" },
      });
      return;
    }

    const existent = await pool.query(
      "SELECT * FROM correctors WHERE name = $1",
      [name]
    );

    if (existent.rowCount! > 0) {
      res.status(409).json({
        data: null,
        err: { message: "Já há um corretor com esse nome cadastrado" },
      });
      return;
    }

    if (isNaN(correctorId)) {
      res
        .status(400)
        .json({ data: null, err: { message: "Corretor inválido" } });
      return;
    }

    const result = await pool.query(
      "UPDATE correctors SET name = $1 WHERE id = $2 RETURNING *",
      [name, correctorId]
    );
    const updatedCorrector: Corrector = result.rows[0];
    if (updatedCorrector) {
      res.json({ data: updatedCorrector, err: null });
    } else {
      res
        .status(404)
        .json({ data: null, err: { message: "Corretor não encontrado" } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ data: null, err: { message: "Internal Server Error" } });
  }
};

export const deleteCorrector = async (req: Request, res: Response) => {
  try {
    const correctorId: any = req.params.correctorId;
    if (isNaN(correctorId)) {
      res
        .status(400)
        .json({ data: null, err: { message: "Corretor inválido" } });
      return;
    }

    const result = await pool.query(
      "DELETE FROM correctors WHERE id = $1 RETURNING *",
      [correctorId]
    );
    const deletedCorrector: Corrector = result.rows[0];
    if (deletedCorrector) {
      res.json({ data: deletedCorrector, err: null });
    } else {
      res
        .status(404)
        .json({ data: null, err: { message: "Corretor não encontrado" } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ data: null, err: { message: "Internal Server Error" } });
  }
};
