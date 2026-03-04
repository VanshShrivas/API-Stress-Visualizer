import AppError from "../utils/AppError.js";

export default function getMetrics(testState) {
    const {
        totalRequests,
        completed,
        success,
        errors,
        latencies,
        buckets,
        counts,
        startTime,
        endTime,
        status
    } = testState;

    const now = endTime ? endTime : Date.now();
    const durationSeconds = (now - startTime) / 1000;

    // Basic safety
    if (completed === 0) {
        return {
            status,
            totalRequests,
            completed: 0,
            success: 0,
            errors: 0,
            buckets,
            counts,
            successRate: 0,
            avgLatency: 0,
            minLatency: 0,
            maxLatency: 0,
            p95Latency: 0,
            throughput: 0
        };
    }

    // ---- Latency Calculations ----
    const sumLatency = latencies.reduce((acc, val) => acc + val, 0);
    const avgLatency = sumLatency / completed;

    const minLatency = Math.min(...latencies);
    const maxLatency = Math.max(...latencies);

    // ---- p95 Calculation ----
    const sortedLatencies = [...latencies].sort((a, b) => a - b);
    const p95Index = Math.ceil(0.95 * completed) - 1;
    const p95Latency = sortedLatencies[p95Index];

    // ---- Rates ----
    const successRate = (success / completed) * 100;
    const errorRate = (errors / completed) * 100;

    // ---- Throughput ----
    const throughput = durationSeconds > 0
        ? completed / durationSeconds
        : 0;

    return {
        status,
        totalRequests,
        completed,
        success,
        errors,
        buckets,
        counts,
        successRate,
        errorRate,
        avgLatency,
        minLatency,
        maxLatency,
        p95Latency,
        throughput
    };
}