import express from 'express'
import startLoadTest from '../services/loadEngine.js';
import abortLoadTest from '../utils/abortLoadTest.js';
import getLoadTestInfo from '../utils/getLoadtestInfo.js';
import getMetrics from '../utils/metrics.js';
import { getTestState } from '../store/testStore.js';
import generatePDFReport from '../utils/pdfGenerator.js';



export const router = express.Router();

router.post("/start-load-test", async (req, res) => {

    const { url, method, headers, body, totalRequests, concurrency } = req.body;
    const config = { url, method, headers, body, totalRequests, concurrency };
    console.log(config);
    try {
        const response = await startLoadTest(config);
        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).send({ error: err.message || "Load test failed" });
    }
})
router.get("/abort-test/:id", (req, res) => {
    res.send(abortLoadTest(req.params.id, getTestState));
})
import TestRun from '../models/TestRun.js';

router.get("/send-test-info/:id", async (req, res) => {
    let info = getLoadTestInfo(req.params.id, getTestState, getMetrics);
    
    // Fallback: If not in memory, check MongoDB
    if (info.error) {
        try {
            const dbRun = await TestRun.findOne({ testId: req.params.id }).lean();
            if (dbRun) {
                // Reconstruct the expected metrics shape from the DB document
                info = {
                    id: dbRun.testId,
                    status: dbRun.status,
                    config: dbRun.config,
                    totalRequests: dbRun.config?.totalRequests,
                    ...dbRun.metrics,
                    buckets: dbRun.latencyHistogram?.buckets || [],
                    counts: dbRun.latencyHistogram?.counts || [],
                    errorStats: dbRun.errorStats || {},
                    history: dbRun.history || [],
                    durationMs: dbRun.durationMs || 0,
                    running: 0 // If it's in DB, it's finished
                };
            }
        } catch (err) {
            console.error("DB Fallback error:", err);
        }
    }
    
    res.send(info);
});

router.get("/download-report/:id", async (req, res) => {
    let testState = getTestState(req.params.id);
    let metrics;

    if (!testState) {
        // Fallback: Check MongoDB
        try {
            const dbRun = await TestRun.findOne({ testId: req.params.id }).lean();
            if (!dbRun) {
                return res.status(404).send({ error: "Test session not found." });
            }
            // Reconstruct testState
            testState = {
                id: dbRun.testId,
                status: dbRun.status,
                config: {
                    url: dbRun.config?.url,
                    method: dbRun.config?.method,
                    concurrency: dbRun.config?.concurrency,
                    totalRequests: dbRun.config?.totalRequests
                },
                history: dbRun.history || []
            };
            // Reconstruct metrics
            metrics = {
                id: dbRun.testId,
                status: dbRun.status,
                ...dbRun.metrics,
                totalRequests: dbRun.config?.totalRequests,
                buckets: dbRun.latencyHistogram?.buckets || [],
                counts: dbRun.latencyHistogram?.counts || [],
                errorStats: dbRun.errorStats || {}
            };
        } catch (err) {
            console.error("DB Fallback error for PDF:", err);
            return res.status(500).send({ error: "Failed to retrieve test report data." });
        }
    } else {
        metrics = getMetrics(testState);
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=loadviz-report-${req.params.id}.pdf`);

    try {
        generatePDFReport(testState, metrics, res);
    } catch (err) {
        console.error("PDF generation failed:", err);
        res.status(500).send({ error: "Failed to generate report." });
    }
});
