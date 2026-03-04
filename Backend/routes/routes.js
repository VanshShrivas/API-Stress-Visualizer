import express from 'express'
import startLoadTest from '../services/loadEngine.js';
import abortLoadTest from '../utils/abortLoadTest.js';
import getLoadTestInfo from '../utils/getLoadtestInfo.js';
import getMetrics from '../utils/metrics.js';
import { getTestState } from '../store/testStore.js';



export const router=express.Router();

router.post("/start-load-test", async(req,res)=>{

    // console.log(req.body.url);
    const {url,method,headers,body,totalRequests,concurrency}=req.body;
    const config={url,method,headers,body,totalRequests,concurrency};
    console.log(config);
    try {
        const response = await startLoadTest(config);
        res.json(response);
        // console.log("this will do all tests")
    } catch (err) {
        console.log(err.message);
        res.status(err.statusCode || 500).send({ error: err.message || "Load test failed" });
    }
})
router.get("/abort-test/:id",(req,res)=>{
    res.send(abortLoadTest(req.params.id,getTestState));
})
router.get("/send-test-info/:id", (req, res) => {
    res.send(getLoadTestInfo(req.params.id,getTestState,getMetrics));
});
