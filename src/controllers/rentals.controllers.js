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


}
export async function finalizeRentals(req, res) {


}
export async function deleteRentals(req, res) {
}