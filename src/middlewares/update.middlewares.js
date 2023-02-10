import { CustomersSchema } from "../schemas/Customers.model.js";
import { connectionDB } from "../database/db.js"; 

export async function validShemaCustomersUpdate(req, res, next) {
  const customer = req.body;
  const customerId = req.params.id;

  const { error } = CustomersSchema.validate(customer, { abortEarly: true });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send({ errors });
  }

  const cpfExist = await connectionDB.query(
    "SELECT * FROM customers WHERE cpf=$1 AND id != $2",
    [customer.cpf, customerId]
  );

  if (cpfExist.rowCount !== 0) {
    return res.status(409).send({ error: "CPF already exists" });
  }

  res.locals.customer = customer;

  next();
}
