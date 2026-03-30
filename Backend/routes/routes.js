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
router.get("/send-test-info/:id", (req, res) => {
    res.send(getLoadTestInfo(req.params.id, getTestState, getMetrics));
});

router.get("/download-report/:id", (req, res) => {
    const testState = getTestState(req.params.id);
    if (!testState) {
        return res.status(404).send({ error: "Test session not found." });
    }

    const metrics = getMetrics(testState);

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
