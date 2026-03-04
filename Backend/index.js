import express, { urlencoded } from 'express'
import cors from 'cors'
import {router} from './routes/routes.js'
import { deleteTestState } from './store/testStore.js';
import { tests } from './store/testStore.js';

const app= express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET','POST','PUT','PATCH', 'DELETE'], 
  credentials: true 
}));
const port=3500;

//mount all the routes
app.use("/api",router); 

app.listen(port,()=>{
    console.log(`Server is active at port ${port}`);
})
