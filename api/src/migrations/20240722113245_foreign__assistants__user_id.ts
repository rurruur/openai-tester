import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("assistants", (table) => {
    // create fk
    table
      .foreign("user_id")
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("assistants", (table) => {
    // drop fk
    table.dropForeign(["user_id"]);
  });
}
