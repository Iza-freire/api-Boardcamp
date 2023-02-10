import { connectionDB } from "../database/db.js";

export async function createCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    await connectionDB.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function retrieveCustomers(req, res) {
  try {
    const result = await connectionDB.query("SELECT * FROM customers");
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getCustomerById(req, res) {
  const customerId = req.params.id;
  try {
    const result = await connectionDB.query(
      "SELECT * FROM customers WHERE id = $1",
      [customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({ error: "Customer not found." });
    }

    res.status(200).send(result.rows[0]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}


export async function putUpdateCustomer(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  try {
    await connectionDB.query(
      "UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5",
      [name, phone, cpf, birthday, id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}


