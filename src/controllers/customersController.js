import connection from "../dbStrategy/postgres.js";

export async function getAllCustomers(req, res) {
    const { cpf: cpfQuery } = req.query;

    try {
        if (cpfQuery) {
            const { rows: customers } = await connection.query("SELECT * FROM customers WHERE cpf LIKE $1", [cpfQuery + "%"]);
            res.status(200).send(customers);
        }
        else {
            const { rows: customers } = await connection.query("SELECT * FROM customers");
            res.status(200).send(customers);
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
}

export async function getCustomerById(req, res) {
    const id = req.params.id;

    try {
        const { rows: customer } = await connection.query("SELECT * FROM customers WHERE id = $1", [id]);
        if (customer.length === 0) {
            res.status(404).send("This customer does not exist.");
            return;
        }
        res.status(200).send(customer[0]);
    }
    catch (error) {
        res.status(500).send(error);
    }
}

export async function insertNewCustomer(req, res) {
    const newCustomer = req.body;

    try {
        await connection.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)", [newCustomer.name, newCustomer.phone, newCustomer.cpf, newCustomer.birthday]);
        res.status(201).send("Customer created successfully.");
    }
    catch (error) {
        res.status(500).send(error);
    }
}

export async function updateCustomer(req, res) {
    const id = req.params.id;
    const updateInfo = req.body;
  
    try { 
        await connection.query(`UPDATE customers 
        SET name = $1, phone = $2, cpf = $3, birthday = $4 
        WHERE id = $5`, [updateInfo.name, updateInfo.phone, updateInfo.cpf, updateInfo.birthday, id]);
        res.status(200).send("Customer info updated successfully.");
    }
    catch (error) {
        res.status(500).send(error);
    }
}
