import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Application from "@ioc:Adonis/Core/Application";
import { schema } from "@ioc:Adonis/Core/Validator";
import fs from "fs";
import { RequestContract } from "@ioc:Adonis/Core/Request";

export default class ProfilesController {
  public async index({ view, params, auth }: HttpContextContract) {
    const user = await User.findBy("username", params.username);

    const posts= await user?.showPostsUser();
    await user?.load("followings");
    await auth.user?.load("followings");
    const followers = await user?.followers();
    if (user) {
      return view.render("auth/profile", {
        user,
        followers,
        posts
      });
    }
    return view.render("errors/not-found");
  }
  public async edit({ view, auth }: HttpContextContract) {
    return view.render("auth/account/edit", {
      auth,
    });
  }

  public async update({
    request,
    auth,
    response,
    session,
    view,
  }: HttpContextContract) {
    const req = await this.validateUpdate(request);

    const path = await this.removeOldImage({ req, auth });
    const user = auth.user;
    if (typeof user !== "undefined") {
      user.details = req.details;
      user.avatar = path;
      user?.save();
      session.flash("success", "you Bio And Picture has updated");
      return response.redirect(`/${auth.user?.username}`);
    }
    return view.render("errors/not-found");
  }

  private async removeOldImage({ req, auth }: { req: any; auth: any; }): Promise<string> {
    const coverImage = req.avatar;
    const date = new Date();
    if (auth.user.avatar) {
      fs.unlinkSync(Application.publicPath(auth.user.avatar));
    }
    let path = `uploads/${date.getFullYear()}/${date.getMonth()}/${date.getDay()}/`;
    await coverImage.move(Application.publicPath(path));
    return path + req.avatar.clientName;
  }

  private async validateUpdate(request: RequestContract) {
    return request.validate({
      schema: schema.create({
        avatar: schema.file({
          size: "2mb",
          extnames: ["jpg", "gif", "png"],
        }),
        details: schema.string({}, []),
      }),
      messages: {
        "avatar.required": "please upload a image",
        "avatar.size": "image must be at least 2mb",
        "avatar.extnames": "file must be type of [jpg, gif, png]",
      },
    });
  }
}
