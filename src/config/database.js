import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const databasePath = new URL("../../database/electricalc.db", import.meta.url);
const schemaPath = new URL("../../database/init.sql", import.meta.url);
const seedsPath = new URL("../../database/seeds.sql", import.meta.url);

export function createDatabase(path = fileURLToPath(databasePath)) {
	const database = new Database(path);
	database.pragma("foreign_keys = ON");
	database.exec(readFileSync(schemaPath, "utf8"));
	database.exec(readFileSync(seedsPath, "utf8"));
	return database;
}

const database = createDatabase();

export default database;
