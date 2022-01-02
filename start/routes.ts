import Route from "@ioc:Adonis/Core/Route";

//home page routes
Route.get("/", "HomeController.index").middleware('auth');

//auth routes
Route.on("/signup").render("auth/signup").middleware("guest");
Route.on("/login").render("auth/login").middleware("guest");
Route.post("/signup", "Auth/AuthController.signup").middleware("guest");
Route.post("/login", "Auth/AuthController.login").middleware("guest");
Route.post("/logout", "Auth/AuthController.logout");
Route.post("/verify-email", "Auth/EmailVerifiesController.verify").middleware(
  "auth"
);
Route.get("/verify/:id", "Auth/EmailVerifiesController.conformEmail")
  .as("verifyEmail")
  .middleware("auth");
Route.get(
  "/auth/verify",
  "Auth/EmailVerifiesController.showResendForm"
).middleware("auth");

// accounts routes
Route.get("/accounts/edit", "Auth/ProfilesController.edit").middleware([
  "auth",
  "verify",
]);
Route.post("/accounts/edit", "Auth/ProfilesController.update").middleware([
  "auth",
  "verify",
]);
Route.get("/:username", "Auth/ProfilesController.index").middleware([
  "auth",
  "verify",
]);

// posts routes
Route.group(() => {
  Route.get("/create", "PostsController.create");
  Route.post("/create", "PostsController.store");
})
  .prefix("/posts")
  .middleware(["auth", "verify"]);

//Follow routes
Route.group(() => {
  Route.post("/:id", "FollowsController.store");
  Route.delete("/:id/delete", "FollowsController.destroy");
})
  .prefix("/follow")
  .middleware(["auth", "verify"]);
