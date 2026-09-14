import { NextApiResponse } from "next";

export const errorResponse = (res: NextApiResponse, statusCode: number = 500, message: string = "Internal Server Error") => {
  res.status(statusCode).send(message);
  res.end();
  return;
}