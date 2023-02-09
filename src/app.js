import express from "express"
import cors from "cors";
import dotenv from "dotenv"
dotenv.config();

import gamesRouter from './routers/game.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(gamesRouter)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});