# JukeBoxd

https://jukeboxd-1.onrender.com/

## TEAM:

JukeBoxd was created by Kathleen Hamrick, Nicholas Crabtree, Nate Santiago, and our two team leads: Ben Hernowitz and Scott Kingsley.

We worked in lock step collaboratively across the project, but at a high level:

- **Kathleen** led user login/registration and styling.
- **Nicholas** led administrator access.
- **Nate** led all things associated with the Spotify API.
- **Scott and Ben** managed all aspects of the project as leads, while also leading query and route integration and making sure code was integrated cohesively through GitHub.

## BUILD DESCRIPTION:

JukeBoxd is build on the PERN stack utilizing postgreSQL, Express.js, Node.js and React. We tied in the Spotify API to retrieve the music data. We used the bcrypt and Json Web Token to handle password encryption and authentication.

## FEATURES:

Avid music appreciators, we built Jukeboxd, a social platform for music enthusiasts that lets users share their favorite albums with friends. Think of it as a dedicated space where music lovers can track albums they’ve listened to, share their favorites, and discover new gems through their social connections.

Jukeboxd solves a key problem in the music discovery space - finding trustworthy recommendations from people whose tastes you actually value. Algorithms can suggest music, but they miss the human element that comes from a trusted friend saying 'you HAVE to hear this album.'

Jukeboxd is built by music lovers, for music lovers. It’s a community where users can rate albums, write reviews, and have meaningful conversations about new or classic genres.

### An Unauthenticated user can:

- View reviews and find albums
- Register for an account
- Click to listen to music on Spotify

### An Authenticated user can:

- View reviews and find albums
- Login to their account
- Click to listen to music on Spotify
- Connect with friends and remove friends they're associated with
- View friends' reviews and comments
- Edit their reviews and comments

### An administrator can:

- View all reviews to edit and delete
- View all comments to edit and delete
- View all users to edit and delete

## INSTALLATION

1. Clone the repository.

2. Execute `npm install` in both the `capstonFE` and `capstoneBE` folders.

3. Within the `capstoneFE` folder, create a `.env` file with the keys:

PGUSER
PGPASSWORD
PGHOST
PGDATABASE
PGPORT
JWT_SECRET
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_EMAIL

4. Within the `capstoneBE` folder, create a `.env` file with the keys:

VITE_API_BASE_URL_DEV
VITE_API_BASE_URL_PROD
VITE_CLIENT_ID
VITE_CLIENT_SECRET

The [`Client_ID`]and [`Client_secret`] are the credentials for the Spotify API that you'll receive after creating an account there. We separated the API base URLs based on the run environment, so set those accordingly.

5. Once the environment is set up, you may run [`npm run seed`]from `capstoneBE` to add minimal data to the database. You will also need to run [`npm run create-admin`] to create the admin-level account.
