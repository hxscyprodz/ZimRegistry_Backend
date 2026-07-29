import { defineConfig } from "drizzle-kit";
import { config } from "./src/config/envConfig";

export default defineConfig({
  schema: "./src/db/schemas/*.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config.POSTGRESQL_URL,
  },
});
