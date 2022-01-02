import { DateTime } from "luxon";
import {
  BaseModel,
  beforeSave,
  column,
  hasMany,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Hash from "@ioc:Adonis/Core/Hash";
import sendEmailVerification from "App/classes/sendEmailVerification";
import mustVerifyEmail from "App/classes/interface/mustVerifyEmail";
import Post from "./Post";
import Following from "./Following";

export default class User extends BaseModel implements mustVerifyEmail {
  public hasVerifiedEmail(): boolean {
    return this.email_verify_at === null ? false : true;
  }

  public async markEmailAsVerified(): Promise<void> {
    this.email_verify_at = DateTime.local();
    await this.save();
  }
  public async sendEmailVerificationNotification(): Promise<void> {
    await new sendEmailVerification(this).sendMail();
  }

  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public email: string;

  @column()
  public username: string;

  @column()
  public avatar: string;

  @column()
  public details: string;

  @column()
  public password: string;

  @column()
  public rememberToken: string;

  @column.dateTime()
  public email_verify_at: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  public async followers() {
    const follow = await Following.query().where("follow_id", this.id);
    return follow;
  }

  public async showPostsUser() {
    return await Post.query()
      .where("user_id", this.id)
      .orderBy("createdAt", "desc");
  }

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>;

  @hasMany(() => Following)
  public followings: HasMany<typeof Following>;
}
