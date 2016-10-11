# reprise

Jam with your friends in real-time. A continuation of [jamWithFriends](https://github.com/ColossalBubble/jamWithFriends).

## Technologies

##### Front end

React, React Router, Tone.js, simple-peer, socket.io-client

##### Back end

Express, Postgres, Passport, socket.io, Sequelize

##### Build

webpack, shell scripts

## Development

### Install application dependencies

```sh
npm install
```

### Setup the database

Be sure to have `postgres` installed on your workstation and to have the
system service running in the background.

Consult your OS's documentation for how to do this.
Use [homebrew](http://www.brew.sh/) if you're on a Mac.

```sh
# Set up the DB & your DB user
npm run db:reset

# Run all pending DB migrations
npm run sequelize db:migrate

# Seed the DB with dummy data
npm run sequelize db:seed:all

# If you want, enter `psql`
npm run db:connect
```

### Environment Variables

Generate a new template for your `.env` file. Note, this will not do anything
if the file already exists.

```sh
npm run setup:env_vars
```

From there, register an application at [Facebook Developers](https://developers.facebook.com/) and fill in the requisite information.

### Running it

Pick one of these two ways:

```sh
# 1. With separate terminal tab for front-end & back-end:
npm run back-end
npm run front-end

# 2. One terminal tab for both front-end & back-end
npm start
```

## Deployment

#### Prepare a source bundle

* `npm run deploy:archive`
* then upload it to AWS

#### Prepare environment

* ssh into AWS
* as a sudo user, `cd` into the path of deployed files. Then run:
  * `npm run deploy:install`
  * `npm run start:prod`
