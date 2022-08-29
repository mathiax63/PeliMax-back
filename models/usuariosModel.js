let pool = require("./bd");
let md5 = require("md5");

async function getUserByUsernameAndPassword(nombre,email, password){
    try{
        let query ="select * from administradores where  nombre = ? and email = ? and password = ?  limit 1";
        let rows = await pool.query(query, [nombre, email, md5(password)]);
        return rows[0]
    }catch(error){
        console.log(error)
    }
}
module.exports = {getUserByUsernameAndPassword}