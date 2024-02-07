
# AstralNova API

## API Reference

#### Get user info

```https
  GET /api/discord/@me
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |


## Run Locally

Clone the project

```bash
  git clone https://github.com/AstralNovaDevelopment/api.git
```

Go to the project directory

```bash
  cd api
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env.example file and rename to .env file

- `DISCORD_CLIENT_SECRET`

- `DISCORD_CLIENT_ID`

- `SESSION_SECRET`

- `DISCORD_CALLBACK_URL`

- `REDIS_CACHE_PORT`

- `DATABASE_PORT`

- `DATABASE_ADDRESS`

- `POSTGRES_USER`

- `POSTGRES_PASSWORD`

- `POSTGRES_DB`

## Roadmap

[Coming Soon]


## Authors

- [@birongliu](https://www.github.com/birongliu)


## Support

For support, please join our Discord server here: https://discord.gg/invite/A65YqRS

