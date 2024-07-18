import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("chats", (table) => {
    // add
    table.integer("from_id").unsigned().notNullable();
    table.integer("to_id").unsigned().notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("chats", (table) => {
    // rollback - add
    table.dropColumns("from_id", "to_id");
    // rollback - drop
    table.integer("user_id").unsigned().notNullable();
    // rollback - add indexes
    // rollback - drop indexes
  });
}
