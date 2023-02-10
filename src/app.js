import express from "express"
import cors from "cors";
import dotenv from "dotenv"
dotenv.config();

import gamesRouter from './routers/game.routes.js';
import customersRouter from './routers/customer.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(gamesRouter);
app.use(customersRouter);

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});