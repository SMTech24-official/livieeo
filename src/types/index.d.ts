import { JwtPayload } from "jsonwebtoken"; // or replace with your User type

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string }; // you can expand this based on your user payload
    }
  }
}