import getMetrics from "../utils/metrics";
import AppError from "../utils/AppError";
import validateEndpoint from "../utils/validateEndpoint"

export default async function startLoadTest(config){

            // 1. Validate config
    if (config.totalRequests <= 0) {
        throw new AppError("totalRequests must be positive", 400);
    }
    if (config.concurrency > config.totalRequests) {
        throw new AppError("Concurrency cannot exceed totalRequests", 400);
    }
    if (!config.url) {
        throw new AppError("URL is required", 400);
    }
            // 2. Validate endpoint (1 test request)
    await validateEndpoint(config);
    
            // Create test state
    const testData={
        
    }
            // Start async scheduler
            // Immediately return testId
            // NOT:
            // Wait for all requests
            // Return final summary

    
}




// //Stress engine me do cheezein parallel chalti hain:
// 1.Request execution
// 2.Metrics aggregation
// Ye dono loosely coupled hone chahiye.