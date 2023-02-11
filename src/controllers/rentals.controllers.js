import { connectionDB } from "../database/db.js";

export async function createRentals(req, res) {

  const {
    customerId,
    gameId,
    daysRented,
    rentDate,
    originalPrice,
    returnDate,
    delayFee,
  } = res.locals.rental;

  try {
    await connectionDB.query(
      `INSERT INTO rentals ("customerId","gameId","daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        customerId,
        gameId,
        daysRented,
        rentDate,
        originalPrice,
        returnDate,
        delayFee,
      ]
    );

  } catch (err) {
    res.status(500).send(err.message);
  }

}
export async function getRentals(req, res) {


}
export async function finalizeRentals(req, res) {


}
export async function deleteRentals(req, res) {
  try {
  } catch (err) {
    res.status(500).send(err.message);
  }
}