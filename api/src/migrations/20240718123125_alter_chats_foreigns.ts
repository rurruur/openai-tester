import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("chats", (table) => {
    table
      .foreign("from_id")
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .foreign("to_id")
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    // drop
    table.dropForeign(["user_id"]);
    table.dropColumns("user_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("chats", (table) => {
    table.dropForeign(["from_id"]);
    table.dropForeign(["to_id"]);
  });
}
