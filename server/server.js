require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.get('/usuario', (req, res) => {
  res.json('get Usuario');
})

app.post('/usuario', (req, res) => {

    let body = req.body;

    if ( body.nombre === undefined ) {
        
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es obligatorio'
        });

    } else {
        res.json({
            persona: body
        });
    }
});

app.put('/usuario/:id', (req, res) => {
    let _id = req.params.id;
    // respuesta luego de procesar la petición
    res.json({
        id: _id
    });
});

app.delete('/usuario', (req, res) => {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});



