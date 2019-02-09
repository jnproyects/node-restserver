
const jwt = require('jsonwebtoken');


/**
 * VERIFICAR TOKEN
 */

let verificarToken = ( req, res, next ) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    name: "JsonWebTokenError",
                    message: "invalid token"
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });


};


/**
 * VERIFICAR ROLE ADMIN
 */

let verificarRoleAdmin = ( req, res, next ) => {

    let usuario = req.usuario;

    // return res.json({
    //     user: usuario
    // })

    if ( usuario.role !== 'ADMIN_ROLE' ) {
        return res.json({
            ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        });
    } else{
        next();
    }



}


module.exports = {
    verificarToken,
    verificarRoleAdmin
}