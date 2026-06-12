import express from 'express';
import TestRun from '../models/TestRun.js';
import compareRuns from '../utils/compareRuns.js';

export const historyRouter = express.Router();

// ─── GET /api/history ───────────────────────────────────────────────
// List all historical runs. Supports ?sortBy=...&order=asc|desc
const ALLOWED_SORT_FIELDS = ['timestamp', 'metrics.avgLatency', 'metrics.p95Latency', 'metrics.throughput'];

historyRouter.get('/history', async (req, res) => {
    try {
        const { sortBy = 'timestamp', order = 'desc' } = req.query;

        const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'timestamp';
        const sortOrder = order === 'asc' ? 1 : -1;

        const runs = await TestRun.find({})
            .select({
                testId: 1,
                timestamp: 1,
                status: 1,
                'config.url': 1,
                'config.method': 1,
                'config.totalRequests': 1,
                'config.concurrency': 1,
                'metrics.avgLatency': 1,
                'metrics.p95Latency': 1,
                'metrics.throughput': 1,
                'metrics.successRate': 1,
                durationMs: 1
            })
            .sort({ [sortField]: sortOrder })
            .lean();

        res.json(runs);
    } catch (err) {
        console.error('[History] Failed to fetch runs:', err.message);
        res.status(500).json({ error: 'Failed to fetch historical runs.' });
    }
});

// ─── GET /api/history/:testId ───────────────────────────────────────
// Full details for one historical run
historyRouter.get('/history/:testId', async (req, res) => {
    try {
        const run = await TestRun.findOne({ testId: req.params.testId }).lean();

        if (!run) {
            return res.status(404).json({ error: 'Historical run not found.' });
        }

        res.json(run);
    } catch (err) {
        console.error('[History] Failed to fetch run details:', err.message);
        res.status(500).json({ error: 'Failed to fetch run details.' });
    }
});

// ─── GET /api/compare?runA=...&runB=... ─────────────────────────────
// Compare two historical runs
historyRouter.get('/compare', async (req, res) => {
    try {
        const { runA, runB } = req.query;

        if (!runA || !runB) {
            return res.status(400).json({ error: 'Both runA and runB query params are required.' });
        }

        if (runA === runB) {
            return res.status(400).json({ error: 'Cannot compare a run with itself.' });
        }

        const [docA, docB] = await Promise.all([
            TestRun.findOne({ testId: runA }).lean(),
            TestRun.findOne({ testId: runB }).lean()
        ]);

        if (!docA) return res.status(404).json({ error: `Run ${runA} not found.` });
        if (!docB) return res.status(404).json({ error: `Run ${runB} not found.` });

        const comparison = compareRuns(docA, docB);

        res.json({
            runA: docA,
            runB: docB,
            comparison
        });
    } catch (err) {
        console.error('[Compare] Failed to compare runs:', err.message);
        res.status(500).json({ error: 'Failed to compare runs.' });
    }
});
