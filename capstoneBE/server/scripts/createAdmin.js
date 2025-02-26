require("dotenv").config();
const { client } = require("../db/index.js");
const { createUser } = require("../db/user.js");

const createAdminUser = async () => {
  try {
    await client.connect();
    console.log("Connected to database");

    const username = process.env.ADMIN_USERNAME || "admin";
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "adminpassword";
    const role = "admin";

    const userExists = await client.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userExists.rows.length > 0) {
      console.log("Admin user already exists");
    } else {
      const response = await createUser(username, email, password, role);
      console.log("Admin user created:", response);
    }

    await client.end();
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

createAdminUser();