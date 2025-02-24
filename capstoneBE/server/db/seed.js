require('dotenv').config();

const { client, createTables } = require('./index.js');
const { createUser } = require('./user.js');
const { createReview } = require('./review.js');

const seed = async () => {
  try {
    await client.connect();
    console.log('connected to database');
    // await createTables();
    console.log('tables created');
    const [kingsley, hamrick, ben, nate, nick, god] = await Promise.all([
      createUser('kingsley', 'sk@ki.com', 'password', 'admin'),
      createUser('hamrick', 'kath@leen.com', 'password', 'user'),
      createUser('ogben', 'ben@rangers.com', 'password', 'admin'),
      createUser('nate', 'nate@florida.com', 'password', 'user'),
      createUser('nick', 'nick@broomfield.co', 'password', 'user'),
      createUser('god', 'god@god.com', 'password', 'user'),
    ]);
    console.log('Users created');
    // const [review1, review2, review3, review4, review5, review6] =
    //   await Promise.all([
    //     createReview(
    //       '03c33123-faed-4762-9d6a-f7d9c61138d3',
    //       kingsley[0].id,
    //       'Donec maximus dolor vel neque ultricies rutrum. Maecenas nec lacus ut orci condimentum tristique. Cras aliquam quis lectus a volutpat. Pellentesque sed mattis urna. Vestibulum eleifend luctus dictum. Donec in pulvinar nunc, quis volutpat lacus. Vivamus lobortis est risus, ut laoreet ligula convallis non. Duis eget urna nulla',
    //       'Headline 6',
    //       '5',
    //       'true'
    //     ),
    //     createReview(
    //       '8f5628aa-eac7-4b03-9474-0f8c8c419412',
    //       hamrick[0].id,
    //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vehicula efficitur blandit. Morbi vulputate lorem eu sodales cursus. Suspendisse nec ligula et neque malesuada suscipit id nec nibh. Phasellus fermentum purus ut nibh fringilla scelerisque. Aliquam dignissim tincidunt magna sed facilisis.',
    //       'Headline 1',
    //       '3',
    //       'false'
    //     ),
    //     createReview(
    //       '46968cdb-898f-4cf3-bdeb-ab92ed4cf2f8',
    //       ogben[0].id,
    //       'Suspendisse egestas finibus enim, at vehicula neque posuere id. Vestibulum nibh dui, pretium at justo vel, tempus auctor arcu. Suspendisse ut ullamcorper nisl. Praesent neque augue, scelerisque ac malesuada at, pharetra nec est. Nulla sed faucibus purus.',
    //       'Headline 2',
    //       '4',
    //       'true'
    //     ),
    //     createReview(
    //       '019bb0af-e171-45e2-a205-0def16c9c496',
    //       nate[0].id,
    //       'Curabitur quis dui vel leo blandit luctus ac vitae purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas eget mauris eget justo aliquam convallis. Duis finibus at enim ut tincidunt. Sed vel nunc tristique, hendrerit nisl non, feugiat urna.',
    //       'Headline 3',
    //       '5',
    //       'true'
    //     ),
    //     createReview(
    //       '019bb0af-e171-45e2-a205-0def16c9c496',
    //       nick[0].id,
    //       'Donec nunc orci, porta accumsan tempus in, gravida sed quam. Pellentesque et augue non diam sollicitudin tristique et sit amet mauris.',
    //       'Headline 4',
    //       '2',
    //       'false'
    //     ),
    //     createReview(
    //       'c3268dbd-56ac-45c7-befe-5eecca7e9b24',
    //       god[0].id,
    //       'Morbi posuere sodales maximus. Maecenas vestibulum et justo vel euismod. Integer sed augue ultrices, faucibus massa nec, bibendum tellus.',
    //       'Headline 5',
    //       '1',
    //       'false'
    //     ),
    //   ]);
    console.log('Reviews Created');
    //seed your database here!
  } catch (error) {
    console.error('error creating tables');
    throw error;
  }
};
seed();
