var express = require('express');
var expressSession = require('express-session');
//var expressSession = require('express-session');
var bodyParser = require('body-parser');
//var i18next = require('i18next');
var mongoose = require('mongoose');

var path = require('path');

var passport = require('passport'); // Passport: Middleware de Node que facilita la autenticación de usuarios

//i18next.init();

// read them synchronously!
/*i18next.init({ getAsync: false , lng: 'es-ES',fallbackLng: 'es-ES' ,preload: ['en-US', 'es-ES'],debug: true},function(t) {
    console.log('Loaded resources ');
    console.log('Lang:' + i18next.lng() +', App name' + i18next.t("app.name"));
})*/;


// Importamos el modelo usuario y la configuración de passport
require('./models/user');
require('./passport')(passport);
var routes = require('./routes');
//var middleware = require('./middleware');


var app = express();

// i18n
//app.use(i18next.handle);
//i18next.registerAppHelper(app)

// If we want to use post data:
app.use(bodyParser({extended: true}));


// For session data:
app.use(expressSession({secret: 'tannedkrab'}) );

// We set middleware
//middleware(app);

// We set routes
//routes(app);

// We set static content
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);

/* Rutas de la aplicación */
// Cuando estemos en http://localhost:puerto/ (la raiz) se ejecuta el metodo index
// del modulo 'routes'
app.get('/', routes.index);

/* Rutas de Passport */
// Ruta para desloguearse
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
// Ruta para autenticarse con Twitter (enlace de login)
app.get('/auth/twitter', passport.authenticate('twitter'));
// Ruta para autenticarse con Facebook (enlace de login)
app.get('/auth/facebook', passport.authenticate('facebook'));
// Ruta de callback, a la que redirigirá tras autenticarse con Twitter.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/twitter/callback', passport.authenticate('twitter',
  { successRedirect: '/', failureRedirect: '/login' }
));
// Ruta de callback, a la que redirigirá tras autenticarse con Facebook.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/', failureRedirect: '/login' }
));


// And there we go, listening on port 3000
app.listen(3000, function () {
    console.log('now listening on http://localhost:3000');
});