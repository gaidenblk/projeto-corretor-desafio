import { Request, Response } from "express";

export const getAdmin = async (req: Request | any, res: Response) => {
  const admin = req.admin;
  res.json({
    err: null,
    data: {
      id: admin.id,
      name: admin.name,
    },
  });
};
