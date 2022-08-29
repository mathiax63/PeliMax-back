var express = require('express');
var router = express.Router();
let todasLasPeliculasModel= require("../../models/zonaAdmin")
const util = require("util") 
const cloudinary = require("cloudinary").v2;
const uploader = util.promisify(cloudinary.uploader.upload)
const destroy = util.promisify(cloudinary.uploader.destroy)

/* GET home page. */
router.get('/', async function(req, res, next) {

let titulosYSinopsis = await todasLasPeliculasModel.todasLasPeliculas()

titulosYSinopsis = titulosYSinopsis.map(peliculas =>{
  if(peliculas.imagenes){
    const imagen = cloudinary.image(peliculas.imagenes,{
      width:100,
      height:100,
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

  res.render('admin/admin', {
    layout: "admin/layout",
    nombre: req.session.nombre,
    title: "Zona de administracion",
    email: req.session.email,
    titulosYSinopsis
  });
});


router.get('/', async function(req, res, next) {
console.log("Pase??")
  let titulosYFoto = await todasLasPeliculasModel.todasLasPeliculas()
  
  
  titulosYFoto = titulosYFoto.map(peliculas =>{
    if(peliculas.imagenes){
      const imagen = cloudinary.image(peliculas.imagenes,{
        width:100,
        height:100,
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
  
    res.render('todasLasPeliculas', {
      layout: "layout",
      titulosYFoto
    });
  });



router.get("/salir", function (req, res){
  req.session.destroy();
  res.render("login",{
    layout: "admin/layout"
  })
})
router.get("/agregar", function (req, res){
  res.render("admin/agregar",{
    layout: "admin/layout"
  })
})





router.post("/agregar", async function(req, res, next) {
  console.log(req.body)
try{
  let imagenes = " ";
  console.log(req.files.imagenes)
  if(req.files && Object.keys(req.files).length >0){
    imagen = req.files.imagenes;
    imagenes = (await uploader(imagen.tempFilePath)).public_id
  }


  if(req.body.titulo != "" && req.body.sinopsis != ""){
      //estos if array.isArray sirven para los checkbox
    if (Array.isArray(req.body.Plataformasparaver)) {
      req.body.Plataformasparaver = req.body.Plataformasparaver.join(',')
    }
    
    if (Array.isArray(req.body.etiquetas)) {
      req.body.etiquetas = req.body.etiquetas.join(',')
    }
    
    await todasLasPeliculasModel.agregarProducto({
      ...req.body, //informacion titulo, sinopsis etc
      imagenes
    });
    res.redirect("/admin/admin")
  } else {
    res.render("admin/agregar", {
      layout: "admin/layout",
      error: true,
      message: "todos los campos"
    })
  }
} catch (error){
  console.log(error)
  res.render("admin/agregar", {
    layout: "admin/layout",
    error: true,
    message: "no se cargo"
  })
}
})

router.get("/eliminar/:id", async(req, res, next) =>{
  let id = req.params.id;
  
  let img = await todasLasPeliculasModel.actualizar(id)
  if (img.imagenes){
    console.log("llegue?")
    await(destroy(img.imagenes))
  }

  await todasLasPeliculasModel.borrar(id);
  res.redirect("/admin/admin")
})

router.get("/editar/:id", async (req, res, next) =>{
  const plataformas = [
    'hbo_max',
    'disney_plus',
    'amazon_Prime',
    'netflix',
    'cuevana'
  ]

  const etiquetas = [
    'aventura',
    'accion',
    'misterio',
    'terror',
    'suspenso',
  ]



  let id = req.params.id;
  let producto = await todasLasPeliculasModel.actualizar(id)
  producto.Plataformasparaver = producto.Plataformasparaver.split(',')
  producto.plataformas = {};
  plataformas.forEach(plataforma => {
    if (producto.Plataformasparaver.includes(plataforma)) {
      producto.plataformas[plataforma] = true;
    } else {
      producto.plataformas[plataforma] = false;
    }
  })
  producto.etiquetas_arr = producto.etiquetas.split(',')
  producto.etiquetas = {};
  etiquetas.forEach(etiqueta => {
    if (producto.etiquetas_arr.includes(etiqueta)) {
      producto.etiquetas[etiqueta] = true;
    } else {
      producto.etiquetas[etiqueta] = false;
    }
  })

  producto.estreno = `${producto.estreno.toISOString().substring(0,10)}`;
  
  res.render("admin/editar", {
    layout: "admin/layout",
    producto
  })
})

router.post("/editar", async (req, res, next) => {
  if (Array.isArray(req.body.Plataformasparaver)) {
    req.body.Plataformasparaver = req.body.Plataformasparaver.join(',')
  }
  
  if (Array.isArray(req.body.etiquetas)) {
    req.body.etiquetas = req.body.etiquetas.join(',')
  }

  try{
    let imagenes = req.body.img_original
    let borrar_vieja = false
    if(req.body.img_delete === "1"){
      imagenes= null;
      borrar_vieja= true;
    }else {
      if(req.files && Object.keys(req.files).length > 0){
        imagen = req.files.imagenes;
        imagenes = (await uploader(imagen.tempFilePath)).public_id;
        borrar_vieja= true
      }
    }
    if(borrar_vieja && req.body.img_original){
      await (destroy(req.body.img_original))
    }


    let obj = {
      titulo: req.body.titulo,
      sinopsis: req.body.sinopsis,
      estrellas: req.body.estrellas,
      trailer: req.body.trailer,
      Plataformasparaver: req.body.Plataformasparaver,
      etiquetas: req.body.etiquetas,
      estreno: req.body.estreno,
      imagenes
    }
    console.log(obj)
    await todasLasPeliculasModel.modificarecho(obj, req.body.id);
    res.redirect("/admin/admin");
  }
  catch(error){
    console.log(error)
    res.render("admin/editar",{
      layout: "admin/layout",
      error: true,
      message:"no se pudo editar"
    })
  }
})



module.exports = router;

