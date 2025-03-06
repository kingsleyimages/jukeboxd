require("dotenv").config();
const { Client } = require("pg");
const { createUser } = require("../db/user.js");

const {
  PGUSER,
  PGPASSWORD,
  PGHOST,
  PGPORT,
  PGDATABASE,
  ADMIN_USERNAME,
  ADMIN_EMAIL,
  ADMIN_PASSWORD
} = process.env;

if (!PGUSER || !PGPASSWORD || !PGHOST || !PGPORT || !PGDATABASE) {
  throw new Error("Missing required environment variables for PostgreSQL connection");
}

const client = new Client({
  connectionString: `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`,
});

const createAdminUser = async () => {
  try {
    await client.connect();
    console.log("Connected to database");

    const username = ADMIN_USERNAME || "admin";
    const email = ADMIN_EMAIL || "admin@example.com";
    const password = ADMIN_PASSWORD || "adminpassword";
    const role = "admin";

    const userExists = await client.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userExists.rows.length > 0) {
      console.log("Admin user already exists");
    } else {
      const response = await createUser(username, email, password, role);
      console.log("Admin user created:", response);
    }

    const allUsers = await client.query("SELECT * FROM users");
    console.log("All users in the database:", allUsers.rows);

    await client.end();
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

createAdminUser();