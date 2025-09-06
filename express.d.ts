import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      user?: string | JwtPayload; // or your own User type
    }
  }
}