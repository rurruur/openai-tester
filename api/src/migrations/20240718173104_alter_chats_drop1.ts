import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("chats", (table) => {
    // drop
    table.dropColumns("summary");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("chats", (table) => {
    // rollback - drop
    table.string("summary", 512).nullable();
    // rollback - add indexes
    // rollback - drop indexes
  });
}
