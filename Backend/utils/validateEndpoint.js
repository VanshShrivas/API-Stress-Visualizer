import AppError from "../utils/AppError.js";

export default async function validateEndpoint(config) {

    // 1. URL format check
    try {
        new URL(config.url);
    } catch {
        throw new AppError("Invalid URL format", 400);
    }
    //2. URL responsiveness check
    const method = (config.method || "GET").toUpperCase();

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        const start = Date.now();
        const response = await fetch(config.url, {
            method,
            headers: config.headers,
            body: ["POST", "PUT", "PATCH"].includes(method) && config.body
                ? JSON.stringify(config.body)
                : undefined,
            signal: controller.signal
        });

        clearTimeout(timeout);

        const latency = Date.now() - start;

        return {
            reachable: true,
            status: response.status,
            latency
        };

    } catch (err) {

        if (err.name === "AbortError") {
            throw new AppError("Validation timed out", 400);
        }

        if (err.code === "ENOTFOUND") {
            throw new AppError("DNS resolution failed", 400);
        }

        if (err.code === "ECONNREFUSED") {
            throw new AppError("Connection refused by server", 400);
        }

        throw new AppError("Target unreachable", 400);
    }
}