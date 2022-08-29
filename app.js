var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require("express-fileupload")
var cors = require("cors")

require("dotenv").config();
let pool = require("./models/bd")

let session = require("express-session")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var todosRouter = require('./routes/todasP');
var especificoRouter = require('./routes/detalle');
var plataformaRouter = require('./routes/plataformas');
let adminRouter = require("./routes/admin/admin")
var apiRouter = require("./routes/api")
var app = express();

let bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:"asdwadgtvbvcjkebytsk",
  cookie:{ maxAge: null },
  resave: false,
  saveUninitialized: true
}));


/*
app.post("/ingresar", function (req, res){
  //console.log("estoy?"+conocido)
if(req.body.email){
    req.session.email = req.body.email
  }


  if(req.body.nombre){
    req.session.nombre = req.body.nombre
  }
  res.redirect("admin/agregar");
})
*/







 secured = async (req, res, next) => {  
  try {
     console.log(req.session.id_usuario);
    if (req.session.id_usuario != undefined) {
      next();
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error)
  }
}

/*app.get("/admin/admin",function (req, res){
  var conocido = Boolean(req.session.nombre);
  res.render("admin/admin", {
    title: "Zona de administracion",
    conocido: conocido,
    nombre: req.session.nombre,
    email: req.session.email
  })
})*/
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}))



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/todasLasPeliculas', todosRouter);
app.use('/detalles', especificoRouter);
app.use('/paginasParaVer', plataformaRouter);
app.use("/admin/admin",secured, adminRouter)
app.use("/api", cors(),apiRouter)



//mostrar todos los datos
/*
pool.query("select * from peliculas").then(function(resultados){
  console.log(resultados)
})
*/
//insertar
/*
let obj = {
  titulo: "spider man no way home",
  sinopsis: "Tras descubrirse la identidad secreta de Peter Parker como Spider-Man, la vida del joven se vuelve una locura. Peter decide pedirle ayuda al Doctor Extraño para recuperar su vida. Pero algo sale mal y provoca una fractura en el multiverso.",
  imagenes: "img/spidermanNWH.jpg.webp",
  trailer: "https://youtu.be/SkmRT3M4Vx4",
  etiquetas: "Ficcion,Aventura,Accion,Superheroes",
  estrellas: 5,
  estreno: "2021-12-17",
  plataformasparaver:"Cuevana, Disney plus"
}
pool.query("insert into peliculas set ?", [obj]).then(function(resultado){
  console.log(resultado)
})
*/


//borrar
/*
let id= 4;
pool.query("delete from peliculas where id=?",[id]).then(function(resultado){
console.log(resultado)
})
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
