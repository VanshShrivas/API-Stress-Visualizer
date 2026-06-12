import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './routes/routes.js';
import { historyRouter } from './routes/historyRoutes.js';
import connectDB from './db.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

const port = process.env.PORT || 3500;

// Mount all routes
app.use("/api", router);
app.use("/api", historyRouter);

// Connect to MongoDB, then start the server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is active at port ${port}`);
    });
});
