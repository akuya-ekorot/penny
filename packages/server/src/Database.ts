import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import * as Redacted from "effect/Redacted"

import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as DrizzleSchemas from "./db/schema.js"

export class DatabaseService extends Effect.Service<DatabaseService>()("app/Database", {
  effect: Effect.gen(function*() {
    const databaseUrl = yield* Config.redacted("DATABASE_URL")
    const pool = new Pool({ connectionString: Redacted.value(databaseUrl) })

    const db = drizzle(pool, {
      schema: DrizzleSchemas,
      logger: true
    })

    return db
  })
}) {}
