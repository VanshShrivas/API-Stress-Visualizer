import getMetrics from "../utils/metrics";
import AppError from "../utils/AppError";
import validateEndpoint from "../utils/validateEndpoint"
import createTestState from "../utils/createTestState";
import { addTestState } from "../store/testStore";
import runScheduler from "../utils/scheduler";

export default async function startLoadTest(config){

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
    if(config.concurreny>567 || config.totalRequests>10000){
        throw new AppError("Keep values under given limits😭",400);
    }
    if (!config.url) {
        throw new AppError("URL is required", 400);
    }
            // 2. Validate endpoint (1 test request)
    await validateEndpoint(config);
    
            // 3. Create test state
    const testState=createTestState(config);
    addTestState(testState);

            // 4. Start async scheduler
    await runScheduler(testState);
    
            // Immediately return testId :(w/o realtime feature: we are just aggreagting all the data into the testStae and returning the id so that the user knows it and can )
    return {testID: testState.id};
            // NOT:
            // Wait for all requests
            // Return final summary
}

// //Stress engine me do cheezein parallel chalti hain:
// 1.Request execution
// 2.Metrics aggregation (testState yahi kar raha hai..it takes in all data thorugh runScheduler(testState));
// Ye dono loosely coupled hone chahiye.