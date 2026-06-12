import mongoose from 'mongoose';

const testRunSchema = new mongoose.Schema({
    testId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['completed', 'aborted'],
        required: true
    },
    config: {
        url: { type: String, required: true },
        method: { type: String, required: true },
        totalRequests: { type: Number, required: true },
        concurrency: { type: Number, required: true }
    },
    metrics: {
        completed: Number,
        success: Number,
        errors: Number,
        successRate: Number,
        errorRate: Number,
        avgLatency: Number,
        minLatency: Number,
        maxLatency: Number,
        p95Latency: Number,
        throughput: Number
    },
    errorStats: {
        success2xx: { type: Number, default: 0 },
        redirect3xx: { type: Number, default: 0 },
        client4xx: { type: Number, default: 0 },
        server5xx: { type: Number, default: 0 },
        networkErrors: { type: Number, default: 0 }
    },
    latencyHistogram: {
        buckets: [Number],
        counts: [Number]
    },
    history: [{
        timestamp: Number,
        throughput: Number,
        successRate: Number,
        errorRate: Number
    }],
    durationMs: Number,

    // TTL: auto-delete documents after 60 days
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        index: { expires: 0 }
    }
});

const TestRun = mongoose.model('TestRun', testRunSchema);

export default TestRun;
