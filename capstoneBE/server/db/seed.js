require("dotenv").config();

const { client, createTables } = require("./index.js");

const seed = async () => {
  try {
    await client.connect();
    console.log("connected to database");
    await createTables();
    // seed your database here!
  } catch (error) {
    console.error("error creating tables");
    throw error;
  }
};
seed();
