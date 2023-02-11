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
  const { returnDate } = req.body;

  try {
    const rentalExists = await connectionDB.query('SELECT * FROM rentals WHERE id = $1', [id]);
    if (rentalExists.rows.length === 0) {
      return res.status(404).send('Rental not found');
    }

    const { rentdate, originalprice, daysrented } = rentalExists.rows[0];
    const pricePerDay = originalprice / daysrented;

    if (rentalExists.rows[0].returnDate) {
      return res.status(400).send('Rental already returned');
    }

    const returnDateObj = returnDate ? new Date(returnDate) : new Date();
    const daysDelay = Math.ceil((returnDateObj - rentdate) / (1000 * 60 * 60 * 24)) - daysrented;
    const delayFee = daysDelay > 0 ? pricePerDay * daysDelay : 0;


    await connectionDB.query(
      `
      UPDATE rentals
      SET "returnDate" = $1, "delayFee" = $2
      WHERE id = $3
      `,
      [returnDateObj, delayFee, id]
    );


    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
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