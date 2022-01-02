import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "App/Models/Post";

export default class HomeController {
  public async index({ view, auth }: HttpContextContract) {
    // await Post.query().preload("user");
    const followers =  (await auth.user?.related("followings").query())?.map(f=>f.followId)
    const userIds = [Number(auth.user?.id),...followers??[]];
    const posts = await Post.query().whereIn('user_id',userIds).preload('user').orderBy("createdAt","desc").exec()
    // return posts 
    return view.render("welcome", {
      posts,
    });
  }
}
