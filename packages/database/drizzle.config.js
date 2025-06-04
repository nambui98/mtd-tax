"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: './drizzle',
    schema: './src/schema/index.ts',
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
        // url:"postgresql://postgres:postgres@localhost:5432/mtdtax"
    },
    migrations: {
        prefix: "timestamp",
        table: "__drizzle_migrations__",
        schema: "public",
    },
    strict: true,
    verbose: true,
});
