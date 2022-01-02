import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class EmailVerifiesController {
  public async showResendForm({
    auth,
    response,
    view,
  }: HttpContextContract): Promise<string | void> {
    if (!auth.user?.hasVerifiedEmail()) {
      return view.render("auth/verify");
    } else {
      return response.redirect(`/${auth.user.username}`);
    }
  }

  public async verify({ auth, response }: HttpContextContract): Promise<void> {
    auth.user?.sendEmailVerificationNotification();
    return response.redirect().back();
  }

  public async conformEmail({
    request,
    response,
    params,
    auth
  }: HttpContextContract): Promise<void | String> {
    if (request.hasValidSignature()) {
      const user = await User.findOrFail(params.id);
      user?.markEmailAsVerified();
      return response.redirect(`/${auth.user?.username}`);
    } else {
      return "invalid token";
    }
  }
}
