const pg = require("pg");
const client = new pg.Client();

const createTables = async () => {
  const SQL = `cd `;
  await client.query(SQL);
};

module.exports = { client };
