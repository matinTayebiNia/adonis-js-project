import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Users extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("username").notNullable().unique();
      table.string("password").notNullable();
      table.string("avatar").nullable();
      table.text("details").nullable();
      table.dateTime('email_verify_at').nullable();
      table.string("remember_token");
      table.timestamps();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
