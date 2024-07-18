import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("threads", (table) => {
    // columns
    table.increments().primary();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.string("uid", 128).notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.uuid("uuid").nullable();

    // indexes
    table.unique(["uuid"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("threads");
}
