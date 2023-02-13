import { connectionDB } from "../database/db.js";

export async function createRentals(req, res) {
  const rental = res.locals.rental;

  try {
    const { customerId, gameId, daysRented, rentDate, originalPrice, returnDate, delayFee } = rental;
    await connectionDB.query(
      `INSERT INTO rentals ("customerId","gameId","daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [customerId, gameId, daysRented, rentDate, originalPrice, returnDate, delayFee]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }

}
export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;

  try {
    let clientRentals;

    const Clause = customerId
      ? 'WHERE rentals."customerId" = $1'
      : gameId
        ? 'WHERE rentals."gameId" = $1'
        : '';

    const queryParams = customerId ? [customerId] : gameId ? [gameId] : [];

    clientRentals = await connectionDB.query(`
      SELECT 
        rentals.*, 
        JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer, 
        JSON_BUILD_OBJECT('id', games.id, 'name', games.name) AS game 
      FROM rentals
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id
      ${Clause};
    `, queryParams);

    return res.status(200).send(clientRentals.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function finalizeRentals(req, res) {
  const { id } = req.params;

  try {
    const rental = await connectionDB.query('SELECT * FROM rentals WHERE id = $1', [id]);

    if (rental.rowCount === 0) {
      return res.sendStatus(404);
    }

    const { returnDate, rentDate, daysRented, originalPrice } = rental.rows[0];

    if (returnDate) {
      return res.sendStatus(400);
    }

    const returnTime = new Date().getTime() - new Date(rentDate).getTime();
    const returnDays = Math.floor(returnTime / (24 * 3600 * 1000));
    const delayFee = Math.max(0, (returnDays - daysRented) * (originalPrice / daysRented));

    await connectionDB.query(
      `UPDATE rentals SET "returnDate" = NOW(), "delayFee" = $1 WHERE id = $2`,
      [delayFee, id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}


export async function deleteRentals(req, res) {

  const { id } = req.params;

  try {
    const result = await connectionDB.query("SELECT * FROM rentals WHERE id=$1", [id]);
    const rental = result.rows[0];

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    if (!rental.returnDate) {
      return res.sendStatus(400);
    }

    await connectionDB.query("DELETE FROM rentals WHERE id=$1", [id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}