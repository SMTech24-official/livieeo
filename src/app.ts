import express, {
  application,
  Application,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import httpStatus from "http-status";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { WebHookRoutes } from "./app/modules/WebHook/webhook.route";
import { visitorLogger } from "./app/middlewares/visitorLogger";

const app: Application = express();

// Expose uploads folder
app.use("/api/v1/uploads", express.static("uploads"));

// here use the webhook json data hanlding middleware
app.use("/api/v1", WebHookRoutes);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://livieeo-frontend.vercel.app",
    ], // frontend URL
    credentials: true, // allow credentials (cookies, auth headers)
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(visitorLogger);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Livieeo!");
});

app.use("/api/v1", router);
app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND",
    error: {
      path: req.originalUrl,
      message: "Your request path is not found!",
    },
  });
});
export default app;
