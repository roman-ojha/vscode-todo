import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";
export type ReqWithUserId = Request<{}, any, any, {}> & { userId: number };
// here we are creating new type by concatenating

export const isAuth: RequestHandler<{}, any, any, {}> = (req, _, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("not authenticated");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("not authenticated");
  }
  try {
    const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    (req as any).userId = payload.userId;
    // so we are going to save the userid which we get form the token which we get form the header and store on a request id
    next();
    return;
  } catch (err) {}
  throw new Error("not authenticated");
};
