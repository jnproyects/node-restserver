
const express = require('express');
let { verificarToken, verificarRoleAdmin } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

// Obtiene todas las categorias, sin paginación
app.get('/categoria', verificarToken, (req, res)=>{

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec( ( err, listaCategorias ) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias: listaCategorias,
        });

    });

});

// Obtiene una categoria por ID
app.get('/categoria/:id', verificarToken, (req, res)=>{

    let _id = req.params.id;

    Categoria.findById( _id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// Crear una nueva categoria
app.post('/categoria', verificarToken, (req, res)=>{

    // retorna la categoria creada
    // req.usuario._id (usuario que ejecuta la petición, se encuentra dentro de verficarToken)

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// Actualizar una categoria
app.put('/categoria/:id', verificarToken, (req, res)=>{

    // actualizar el nombre de la categoria
    let _id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }
    
    Categoria.findByIdAndUpdate( _id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        // respuesta que se le da al usuario luego de procesar la petición
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// Borrar una categoria, NO cambiar estado
app.delete('/categoria/:id', [ verificarToken, verificarRoleAdmin ], (req, res)=>{

    let _id = req.params.id;
    // sólo admin puede borrar categorias
    // Categoria.findbyidandremove()
    Categoria.findByIdAndRemove(_id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });

    });

});

module.exports = app;