"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const textToJSONParser = (req, res, next) => {
    if (req?.body?.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
};
exports.default = textToJSONParser;
// import { Request, Response, NextFunction } from 'express';
// const textToJSONParser = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void => {
//   try {
//     // যদি req.body.data থাকে
//     if (req.body?.data && typeof req.body.data === 'string') {
//       req.body = JSON.parse(req.body.data);
//     }
//     // যদি req.body মূলত string হয়
//     else if (typeof req.body === 'string') {
//       req.body = JSON.parse(req.body);
//     }
//   } catch (err) {
//     res.status(400).json({ success: false, message: "Invalid JSON body" });
//     return;
//   }
//   next();
// };
// export default textToJSONParser;
//# sourceMappingURL=textToJsonParser.js.map