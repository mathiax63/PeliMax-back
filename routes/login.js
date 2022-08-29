var express = require('express');
var router = express.Router();
let usuarioModelo = require("../models/usuariosModel");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post("/", async (req, res, next) =>{
  try{
    
    let nombre = req.body.nombre
    let password = req.body.password
    let email =req.body.email
    let data = await usuarioModelo.getUserByUsernameAndPassword(nombre, email, password)
    console.log(data)
    if (data != undefined){

      req.session.id_usuario = data.id
      req.session.nombre = data.nombre
      req.session.email = data.email

      res.redirect("admin/admin");
    } else {
      res.render("login", {
        layout:"layout",
        error: true
      })
    }
  }catch (error){
    console.log(error)
  }
})





module.exports = router;
