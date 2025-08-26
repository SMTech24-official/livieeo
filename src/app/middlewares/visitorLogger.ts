import { Request, Response, NextFunction } from "express";
import prisma from "../../shared/prisma";

export const visitorLogger = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    await prisma.webVisitor.create({
      data: { ip, userAgent },
    });
  } catch (error) {
    console.error("Visitor log failed:", error);
  }
  next();
};