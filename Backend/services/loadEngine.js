import getMetrics from "../utils/metrics.js";
import AppError from "../utils/AppError.js";
import validateEndpoint from "../utils/validateEndpoint.js"
import createTestState from "../utils/createTestState.js";
import { addTestState } from "../store/testStore.js";
import { tests } from "../store/testStore.js";
import runScheduler from "../utils/scheduler.js";

export default async function startLoadTest(config) {

    // 1. Validate config
    if (config.totalRequests <= 0) {
        throw new AppError("totalRequests must be positive", 400);
    }
    if (config.concurrency <= 0) {
        throw new AppError("Concurrency must be positive", 400);
    }
    if (config.concurrency > config.totalRequests) {
        throw new AppError("Concurrency cannot exceed totalRequests", 400);
    }
    if (config.concurrency > 567 || config.totalRequests > 10000) {
        throw new AppError("Keep values under given limits😭", 400);
    }
    if (!config.url) {
        throw new AppError("URL is required", 400);
    }
    // 2. Validate endpoint (1 test request)
    await validateEndpoint(config);

    // 3. Create test state
    const testState = createTestState(config);
    addTestState(testState);
    console.log(testState);
    // 4. Start async scheduler
    runScheduler(testState);

    // 5. Start history ticker for report generation
    const ticker = setInterval(() => {
        if (testState.status !== "running") {
            clearInterval(ticker);
            return;
        }
        const metrics = getMetrics(testState);
        testState.history.push({
            timestamp: Date.now(),
            throughput: metrics.throughput,
            successRate: metrics.successRate,
            errorRate: metrics.errorRate
        });
    }, 1000);

    // 6. Immediately return testId
    return { testID: testState.id };
}

// //Stress engine me do cheezein parallel chalti hain:
// 1.Request execution
// 2.Metrics aggregation (testState yahi kar raha hai..it takes in all data thorugh runScheduler(testState));
// Ye dono loosely coupled hone chahiye.