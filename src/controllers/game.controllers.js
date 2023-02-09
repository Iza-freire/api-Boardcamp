import { connectionDB } from "../database/db.js";

export async function createGames(req, res) {
    const {name, image, stockTotal, pricePerDay} = res.locals.game;

    try {
        await connectionDB.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`, 
        [name, image, stockTotal, pricePerDay])
        
        res.sendStatus(201)
    
    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function retrieveGames(req, res) {
  try {
    const result = await connectionDB.query("SELECT * FROM games");
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

