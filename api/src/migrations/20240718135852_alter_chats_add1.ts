import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("chats", (table) => {
    // add
    table.string("summary", 512).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("chats", (table) => {
    // rollback - add
    table.dropColumns("summary");
    // rollback - add indexes
    // rollback - drop indexes
  });
}
