var express = require('express');
var router = express.Router();
let todasLasPeliculasModel= require("../models/zonaAdmin")
const cloudinary = require("cloudinary").v2;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('detalles');
});
router.get('/detalles/:id', async function(req, res, next) {
  //console.log("Pase??")
    let titulosYFoto = await todasLasPeliculasModel.lasPDet()
    
    
    titulosYFoto = titulosYFoto.map(peliculas =>{
      if(peliculas.imagenes){
        const imagen = cloudinary.image(peliculas.imagenes,{
          width:200,
          height:200,
          crop:"fill"
        });
        return {
          ...peliculas,
          imagen
        }
      }else{
        return {
          ...peliculas,
          imagen:" "
        }
      }
    })
    
      res.render('detalles', {
        layout: "layout",
        titulosYFoto
      });
    });
     

  
 
  


module.exports = router;
