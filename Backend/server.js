import express, { urlencoded } from 'express'
import cors from 'cors'
import routes from './routes/routes'
const app= express();
app.use(express(urlencoded=true));
app.use(cors());

const port=3000;

//mount all the routes
app.use("/api",routes); //like the /api/route aayega

app.listen(port,()=>{
    console.log(`Server is active at port ${port}`);
})