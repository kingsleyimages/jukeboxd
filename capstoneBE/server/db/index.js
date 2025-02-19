const pg = require('pg');
const client = new pg.Client();

// export all the functions from both files
module.exports = { client, ...require('./user.js'), ...require('./review.js') };
