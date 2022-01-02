import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Followings extends BaseSchema {
  protected tableName = 'followings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer("user_id").unsigned().references("users.id");
      table.integer("follow_id")
      table.unique(["user_id", "follow_id"]);
      table.timestamps();
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
