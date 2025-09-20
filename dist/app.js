"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const webhook_route_1 = require("./app/modules/WebHook/webhook.route");
const visitorLogger_1 = require("./app/middlewares/visitorLogger");
const app = (0, express_1.default)();
// here use the webhook json data hanlding middleware
app.use("/api/v1", webhook_route_1.WebHookRoutes);
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:3001", "https://livieeo-frontend.vercel.app"], // frontend URL
    credentials: true, // allow credentials (cookies, auth headers)
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(visitorLogger_1.visitorLogger);
app.get("/", (req, res) => {
    res.send("Hello from Livieeo!");
});
app.use("/api/v1", routes_1.default);
app.use(globalErrorHandler_1.default);
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND",
        error: {
            path: req.originalUrl,
            message: "Your request path is not found!",
        },
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map