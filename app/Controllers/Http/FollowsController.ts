import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Following from "App/Models/Following";

export default class FollowsController {
  public async store({ params, response, auth, session }: HttpContextContract) {
    const userId = params.id;
    const follow = new Following();
    follow.userId = Number(auth.user?.id);
    follow.followId = Number(userId);
    await follow.save();

    session.flash("success", "the user added to your following");
    return response.redirect().back();
  }

  public async destroy({
    params,
    auth,
    response,
    session,
  }: HttpContextContract) {
    const follow = await Following.query()
      .where("user_id", Number(auth.user?.id))
      .where("follow_id", params.id).first();

     await follow?.delete();
    session.flash('success',"the user removed from followers")
    return response.redirect().back();
  }
}
