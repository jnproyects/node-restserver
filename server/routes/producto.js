
const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


// Obtener todos los productos
app.get('/producto', verificarToken, (req, res)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limitePorPagina = req.query.limite || 5;
    limitePorPagina = Number(limitePorPagina);

    Producto.find({ disponible: true })
    .sort('descripcion')
    .populate('usuario categoria', 'nombre email descripcion')
    .skip(desde)
    .limit(limitePorPagina)
    .exec( (err, listaProductos) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        

        res.json({
            ok: true,
            productos: listaProductos
        });

    });

});

// Obtener producto por ID
app.get('/producto/:id', (req, res)=>{

    let _id = req.params.id;

    Producto.findById( _id )
    .populate('usuario categoria', 'nombre email descripcion')
    .exec( (err, productoDB) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del producto no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
});

// Buscar productos
app.get('/producto/buscar/:termino', verificarToken, (req, res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ descripcion: regex })
    .populate('categoria', 'descripcion')
    .exec( (err, productosDB)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: err
            });
        }

        res.json({
            ok: true,
            productos: productosDB
        })


    });

});

// Crear producto
app.post('/producto', verificarToken, (req, res)=>{

    let body = req.body;

    // console.log(body);
    
    let nuevoProducto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUnico,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    nuevoProducto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

// Actualizar producto
app.put('/producto/:id', verificarToken, (req, res)=>{

    let _id = req.params.id;
    let body = req.body;

    let actualizaProducto = {
        nombre: body.nombre,
        precioUni: body.precioUnico,
        descripcion: body.descripcion,
        categoria: body.categoria,
        disponible: body.disponible
    }

    Producto.findByIdAndUpdate( _id, actualizaProducto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto no existe'
            });
        }

        // respuesta que se le da al usuario luego de procesar la petición
        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

// Borrar producto
app.delete('/producto/:id', (req, res)=>{

    // cambiar estado disponible a false
    let _id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate( _id, cambiaEstado, { new: true }, (err, productoDB)=>{

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            mensaje: 'Producto borrado'
        });

    });

});


module.exports = app;