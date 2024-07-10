import { Request, Response, NextFunction } from "express";
import pool from "../database";

export const authMiddleware = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      data: null,
      err: { message: "Token não informado" },
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const result = await pool.query("SELECT * FROM admins WHERE token = $1", [
      token,
    ]);
    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({
        data: null,
        err: { message: "Token inválido" },
      });
    }

    req.admin = admin;
    setTimeout(() => next(), 2000);
  } catch (error) {
    res.status(500).json({
      data: null,
      err: { message: "Internal Server Error" },
    });
  }
};
