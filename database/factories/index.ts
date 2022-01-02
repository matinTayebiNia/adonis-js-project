import Factory from "@ioc:Adonis/Lucid/Factory";
import Post from "App/Models/Post";
import User from "App/Models/User";
import { DateTime } from "luxon";

export const userFactory = Factory.define(User, ({ faker }) => {
  return {
    name: faker.name.firstName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    email_verify_at: DateTime.local(),
    details: faker.lorem.paragraph(),
    avatar: faker.image.avatar(),
  }; 
})
  .relation("posts", () => postFactory)
  .build();

export const postFactory = Factory.define(Post, ({ faker }) => {
  return {
    caption: faker.lorem.paragraph(),
    image: faker.image.animals(),
  };
})
  .relation("user", () => userFactory)
  .build();
