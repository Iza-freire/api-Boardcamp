import { rentalSchemma } from "../schemas/rentals.model.js";
import { connectionDB } from "../database/db.js";

export async function validShemaRentals(req, res, next) {

  const { customerId, gameId, daysRented } = req.body;

  try {
    const game = await connectionDB.query("SELECT * FROM games WHERE id=$1", [
      gameId,
    ]);

    if (game.rowCount === 0) {
      return res.sendStatus(400);
    }

    const rental = {
      customerId,
      gameId,
      daysRented,
      rentDate: new Date(),
      originalPrice: daysRented * game.rows[0].pricePerDay,
      returnDate: null,
      delayFee: null,
    };

    const { error } = rentalSchemma.validate(rental, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send({ errors });
    }

    const customerIdExists = await connectionDB.query(
      "SELECT * FROM customers WHERE id=$1",
      [customerId]
    );

    if (customerIdExists.rowCount === 0) {
      return res.sendStatus(400);
    }

    res.locals.rental = rental;
    res.locals.game = game;

    const gameData = res.locals.game;
    const rentals = await connectionDB.query(
      `SELECT * FROM rentals WHERE "gameId"=$1`,
      [gameData.rows[0].id]
    );

    console.log(rentals.rows.length);

    if (rentals.rows.length > gameData.rows[0].stockTotal) {
      return res.sendStatus(400);
    }

    next();

  } catch (err) {
    res.status(500).send(err.message);
  }
}