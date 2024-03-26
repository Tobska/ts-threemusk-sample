import { Knex, knex as knexInit } from "knex";

const config: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: false,
    charset: "utf8"
  }
};

export const knex = knexInit(config);
