"use strict";
/*
|--------------------------------------------------------------------------
| Application middleware
|--------------------------------------------------------------------------
|
| This file is used to define middleware for HTTP requests. You can register
| middleware as a `closure` or an IoC container binding. The bindings are
| preferred, since they keep this file clean.
|
*/
exports.__esModule = true;
var Server_1 = require("@ioc:Adonis/Core/Server");
/*
|--------------------------------------------------------------------------
| Global middleware
|--------------------------------------------------------------------------
|
| An array of global middleware, that will be executed in the order they
| are defined for every HTTP requests.
|
*/
Server_1["default"].middleware.register([
    function () { return Promise.resolve().then(function () { return require("@ioc:Adonis/Core/BodyParser"); }); },
    function () { return Promise.resolve().then(function () { return require("App/Middleware/SilentAuth"); }); },
]);
/*
|--------------------------------------------------------------------------
| Named middleware
|--------------------------------------------------------------------------
|
| Named middleware are defined as key-value pair. The value is the namespace
| or middleware function and key is the alias. Later you can use these
| alias on individual routes. For example:
|
| { auth: () => import('App/Middleware/Auth') }
|
| and then use it as follows
|
| Route.get('dashboard', 'UserController.dashboard').middleware('auth')
|
*/
Server_1["default"].middleware.registerNamed({
    auth: function () { return Promise.resolve().then(function () { return require("App/Middleware/Auth"); }); },
    guest: function () { return Promise.resolve().then(function () { return require("App/Middleware/RedirectifNotAuthtication"); }); },
    verify: function () { return Promise.resolve().then(function () { return require("App/Middleware/EnsureEmailIsVerified"); }); }
});
