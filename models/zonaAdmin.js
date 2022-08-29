let pool = require("./bd");


async function todasLasPeliculas(){
    
        let query ="select * from peliculas";
        let rows = await pool.query(query);
        //console.log(rows)
        return rows
    
}
async function agregarProducto(obj){
    try{
        let query ="insert into peliculas set ?";
        let rows = await pool.query(query, [obj])
        return rows;
    } catch(error){
        console.log(error);
        throw error;
    }
}
async function borrar(id){
    let query = "delete from peliculas where id = ?";
    let rows = await pool.query(query, [id]);
    return rows
}

async function actualizar(id) {
    let query = "select * from peliculas where id = ?"
    let rows = await pool.query(query, [id]);
    return rows[0]
}

async function modificarecho(obj, id){
    try{
        let query = "update peliculas set ? where id=?";
        let rows = await pool.query(query, [obj, id]);
        return rows;
    }catch(error){
        throw error
    }
}
async function las5P(){
    
    let query ="select * from peliculas order by id desc limit 5 ";
    let rows = await pool.query(query);
    //console.log(rows)
    return rows

}
async function las5PD(){
    
    let query ="select * from peliculas order by estrellas desc limit 5 ";
    let rows = await pool.query(query);
    //console.log(rows)
    return rows

}

async function lasPDet(){
    
    let query ="select * from peliculas where id = ?";
    let rows = await pool.query(query, [id]);
    return rows[0]


}

module.exports = {todasLasPeliculas, agregarProducto, borrar, actualizar, modificarecho,las5P,las5PD,lasPDet}