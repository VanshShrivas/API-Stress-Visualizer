//this creates a new testState for the user 
import { randomUUID } from "crypto";
export default function createTestState(config){
    let testState= {
        id:randomUUID(),
        config,
        status: "running",
        totalRequests: config.totalRequests,
        concurrency: config.concurrency,
        completed: 0,
        success: 0,
        errors: 0,
        latencies: [],
        buckets:[0,100,200,400,800,1000,1500,2000,3000,5000,10000,30000],
        counts:[0,0,0,0,0,0,0,0,0,0,0,0],
        errorStats: {
            success2xx: 0,
            redirect3xx: 0,
            client4xx: 0,
            server5xx: 0,
            networkErrors: 0
        },
        history: [],
        aborted:false,
        startTime: Date.now(),
        endTime: null
    }
    return testState;
}