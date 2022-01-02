import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

export default class AuthController {
  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout();
    return response.redirect("/");
  }

  public async login({
    auth,
    request,
    response,
    session,
  }: HttpContextContract): Promise<void> {
    const req = await this.validationLogin(request);
    if (await auth.attempt(req.email, req.password)) {
      session.flash("success", "you log in on system");
      return response.redirect(`/${auth.user?.username}`);
    }
  }

  public async signup({
    request,
    auth,
    
    response
  }: HttpContextContract): Promise<void> {
    const req = await this.validationRegister(request);
    const user = new User();
    user.name = req.name;
    user.email = req.email;
    user.username = req.username;
    user.password = req.password;
    await user.save();

    user.sendEmailVerificationNotification();
    await auth.attempt(req.email, req.password)
    return response.redirect(`/${auth.user?.username}`)
  }

  public async validationLogin(request) {
    return request.validate({
      schema: schema.create({
        email: schema.string({}, [rules.email()]),
        password: schema.string({}, [rules.minLength(8)]),
      }),
      messages: {
        "email.required": "email is required",
        "email.email": "please enter the valid email address",
        "password.required": "password is required",
        "password.minLength": "password most be more than 8 characters",
      },
    });
  }

  public async validationRegister(request) {
    return await request.validate({
      schema: schema.create({
        name: schema.string({}, [rules.minLength(4)]),
        email: schema.string({}, [
          rules.email(),
          rules.unique({ table: "users", column: "email" }),
        ]),
        username: schema.string({}, [
          rules.unique({ table: "users", column: "username" }),
        ]),
        password: schema.string({}, [rules.minLength(8), rules.confirmed()]),
      }),
      messages: {
        "name.required": "name is required",
        "name.minLength": "name most be more than 4 characters",
        "email.required": "email is required",
        "username.required": "username is required",
        "email.email": "please enter a valid email address",
        "email.unique": "this email is already use ",
        "username.unique": "this username is already use ",
        "password.required": "password is required",
        "password.minLength": "password most be more than 8 characters",
        "password_confirmation.confirmed":
          "the password doesn't match with confirmedPassword",
      },
    });
  }
}
