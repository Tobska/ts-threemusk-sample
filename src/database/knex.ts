import { Knex, knex as knexInit } from "knex";

const config: Knex.Config = {
  client: "pg",
  connection: {
    // host: "172.17.0.1",
    host: "10.0.2.15",
    port: 5432,
    database: "sample_db",
    user: "postgres",
    password: "postgres",
    ssl: false,
    charset: "utf8",
  },
};

export const knex = knexInit(config);
