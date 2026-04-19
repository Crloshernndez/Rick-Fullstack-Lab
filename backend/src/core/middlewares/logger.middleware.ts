import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

/**
 * HTTP request logging middleware.
 *
 * Intercepts every incoming request and logs a structured summary once the
 * response has finished. Logging is deferred to the `finish` event so that
 * the final status code and response duration are available.
 *
 * Log levels are assigned automatically based on the HTTP status code:
 * - `INFO`  — 2xx and 3xx responses (successful or redirected)
 * - `WARN`  — 4xx responses (client errors)
 * - `ERROR` — 5xx responses (server errors)
 *
 */
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = randomUUID();
  const startTime = Date.now();

  // Propagate the request ID so it can be traced end-to-end
  req.headers["x-request-id"] = requestId;
  res.setHeader("x-request-id", requestId);

  /**
   * Defer logging to the `finish` event — only at this point are the
   * final status code and response duration available.
   */
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    const method = req.method;
    const path = req.originalUrl;
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const userAgent = req.get("user-agent") ?? "unknown";

    const level = status >= 500 ? "ERROR" : status >= 400 ? "WARN" : "INFO";

    console.log(
      `[${new Date().toISOString()}] [${level}] [${requestId}] ${method} ${path} ${status} ${duration}ms | IP: ${ip} | UA: ${userAgent}`
    );
  });

  next();
};
