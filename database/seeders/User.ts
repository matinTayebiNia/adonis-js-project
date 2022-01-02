import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import { userFactory } from "Database/factories";

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await userFactory.with("posts", 3).createMany(10);
  }
}
