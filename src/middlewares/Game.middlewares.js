import { GameSchema } from "../schemas/Game.model.js";
import { connectionDB } from "../database/db.js";

export async function validShemaGames(req, res, next) {
  const game = req.body;

  const { error } = GameSchema.validate(game, { abortEarly: true });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send({ errors });
  }

  if (game.stockTotal <= 0 || game.pricePerDay <= 0) {
    return res.status(400).send({
      errors: ["stockTotal e pricePerDay devem ser maiores que 0"],
    });
  }

  const nameExist = await connectionDB.query(
    "SELECT * FROM games WHERE name=$1",
    [game.name]
  );
  
  if (nameExist.rowCount !== 0) {
    return res.sendStatus(409);
  }

  res.locals.game = game;

  next();
}



