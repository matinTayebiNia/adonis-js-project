import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import { RequestContract } from "@ioc:Adonis/Core/Request";
import Application from "@ioc:Adonis/Core/Application";
import Post from "App/Models/Post";

export default class PostsController {
  public async index() {}

  public async create({ view }: HttpContextContract): Promise<string> {
    return view.render("posts/create");
  }
  public async store({
    request,
    auth,
    session,
    response,
  }: HttpContextContract) {
    const req = await this.validateCreate(request);
    const coverImage = req.image;
    const date = new Date();
    let path = `posts/${date.getFullYear()}/${date.getMonth()}/${date.getDay()}/`;
    await coverImage.move(Application.publicPath(path));
    const post = new Post();
    post.image = path + req.image.clientName;
    post.caption = req.caption;
    post.userId = Number(auth.user?.id);
    await post.save();
    session.flash("success", "post added successfully");
    return response.redirect(`/${auth.user?.username}`);
  }

  private async validateCreate(request: RequestContract): Promise<any> {
    return request.validate({
      schema: schema.create({
        image: schema.file({
          size: "2mb",
          extnames: ["jpg", "gif", "png"],
        }),
        caption: schema.string({}, []),
      }),
      messages: {
        "avatar.required": "please upload a image",
        "avatar.size": "image must be at least 2mb",
        "avatar.extnames": "file must be type of [jpg, gif, png]",
      },
    });
  }
}
