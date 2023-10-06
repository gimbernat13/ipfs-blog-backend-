import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY || "myFallbackSecretKey";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (token == null) {
    console.log("🛑 No JWT token provided");
    return res.sendStatus(401); 
  }

  jwt.verify(token, SECRET_JWT_KEY as string, (err: any, user: any) => {
    if (err) {
      console.log("🔥 JWT error:", err);
      return res.sendStatus(403);
    }
    console.log("✅ JWT successfully verified for user:", user);
    req.user = user;
    next(); 
  });
};
