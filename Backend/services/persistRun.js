import getMetrics from '../utils/metrics.js';
import TestRun from '../models/TestRun.js';

/**
  Persists a completed/aborted test run to MongoDB.
  Reused the existing getMetrics() aggregation 
  Called once from the scheduler when a test finishes.
 */
export default async function persistCompletedRun(testState) {
    try {
        const metrics = getMetrics(testState);

        const doc = new TestRun({
            testId: testState.id,
            timestamp: new Date(testState.endTime || Date.now()),
            status: testState.status,
            config: {
                url: testState.config.url,
                method: (testState.config.method || 'GET').toUpperCase(),
                totalRequests: testState.totalRequests,
                concurrency: testState.concurrency
            },
            metrics: {
                completed: metrics.completed,
                success: metrics.success,
                errors: metrics.errors,
                successRate: metrics.successRate,
                errorRate: metrics.errorRate,
                avgLatency: metrics.avgLatency,
                minLatency: metrics.minLatency,
                maxLatency: metrics.maxLatency,
                p95Latency: metrics.p95Latency,
                throughput: metrics.throughput
            },
            errorStats: metrics.errorStats || testState.errorStats,
            latencyHistogram: {
                buckets: metrics.buckets,
                counts: metrics.counts
            },
            history: testState.history || [],
            durationMs: (testState.endTime || Date.now()) - testState.startTime
        });

        await doc.save();
        console.log(`[Persist] Test run ${testState.id} saved to MongoDB (status: ${testState.status})`);

    } catch (err) {
        // Log but don't crash — persistence failure should not break the load testing flow
        console.error(`[Persist] Failed to save test run ${testState.id}:`, err.message);
    }
}
