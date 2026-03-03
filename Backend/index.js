import express, { urlencoded } from 'express'
import cors from 'cors'
import {router} from './routes/routes.js'
const app= express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

const port=3000;

//mount all the routes
app.use("/api",router); //like the /api/route aayega

app.listen(port,()=>{
    console.log(`Server is active at port ${port}`);
})