import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import mustVerifyEmail from "App/classes/interface/mustVerifyEmail";

export default class EnsureEmailIsVerified {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if (
      !auth.user ||
      (this.verifyEmailIsActivited(auth.user) && !auth.user?.hasVerifiedEmail())
    ) {
      return response.redirect("/auth/verify");
    }

    await next();
  }

  private verifyEmailIsActivited(arg: mustVerifyEmail): arg is mustVerifyEmail {
    return (arg as mustVerifyEmail).hasVerifiedEmail !== undefined;
  }
}
