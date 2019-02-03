
const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario', (req, res) => {
   
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limitePorPagina = req.query.limite || 5;
    limitePorPagina = Number(limitePorPagina);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
            .skip(desde)
            .limit(limitePorPagina)
            .exec( (err, listaUsuarios) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({ estado: true }, (err, cantidadUsuarios) => {

                    res.json({
                        ok: true,
                        usuarios: listaUsuarios,
                        totalUsuarios: cantidadUsuarios
                    });

                })


            });



});

app.post('/usuario', (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save( (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/:id', (req, res) => {


    let _id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    
    Usuario.findByIdAndUpdate( _id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }


        // respuesta que se le da al usuario luego de procesar la petición
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.delete('/usuario/:id', (req, res) => {

    let _id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    
    Usuario.findByIdAndUpdate( _id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });


    /**BORRAR EL REGISTRO DE LA BD */

    // Usuario.findByIdAndRemove(_id, (err, usuarioBorrado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });

    // });


});

module.exports = app;