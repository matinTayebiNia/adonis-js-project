import Event from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from "@ioc:Adonis/Core/Env";
import Route from "@ioc:Adonis/Core/Route";
import User from "App/Models/User";

export default class sendEmailVerification {
  private user: { id: Number; email: string };

  constructor(user: User) {
    this.user = user;
  }

  public signedUrl(): string {
    return (
      Env.get("APP_URL") +
      Route.makeSignedUrl(
        "verifyEmail",
        {
          id: this.user.id,
        },
        {
          expiresIn: "20m",
        }
      )
    );
  }

  public async sendMail(): Promise<void> {
    Event.on('mail:sent', Mail.prettyPrint)
     await Mail.sendLater((message) => {
      message
        .from("verify@adonisjsProject.com")
        .to(this.user.email)
        .subject("verify Email")
        .htmlView("emails/verifyEmail", {
          user: this.user,
          url: this.signedUrl(),
        });
    });
  }
}
