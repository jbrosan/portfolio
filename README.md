# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

```

## Production

Build the application for production:

```bash
# npm
npm run build

```

Locally preview production build:

```bash
# npm
npm run preview

```

## Docker Compose ENV vars

```bash
# env variables used by docker-compose
DB_USER=<Database user name>
DB_PASSWORD=<Database password>
DB_PORT=<Database port>
DB_DATABASE=<Database to use>

```

## Script breakdown

| Script       | Description                                                                               |
| ------------ | ----------------------------------------------------------------------------------------- |
| `db:up`      | Starts the PostgreSQL container in detached mode. Creates the volume if it doesn’t exist. |
| `db:down`    | Stops and removes the container (but keeps the volume/data).                              |
| `db:logs`    | Follows logs for quick troubleshooting (like checking startup or connection issues).      |
| `db:ps`      | Shows container status.                                                                   |
| `db:restart` | Quick teardown + startup combo.                                                           |
