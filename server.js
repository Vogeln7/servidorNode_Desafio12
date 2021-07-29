//IMPORTACION

const express = require('express');
const app = express();
const http = require('http').Server(app);


// le pasamos la constante http a socket.io
const io = require('socket.io')(http);

let producto=require('./productos');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(__dirname + '/public'));



// Motor de plantilla
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) {});
app.set('view engine', 'hbs');

app.get('/',(req,res)=>{
    res.render('index')
});

//cuando se realice la conexion, se ejecutara una sola vez
io.on('connection', socket => {
    console.log('usuario conectado');

    socket.on('producto', data => {
        producto.nuevoProducto(data)
        io.sockets.emit('productos',{productos: producto.productosListados} );
    });
    

    io.sockets.emit('productos',{productos: producto.productosListados} );
    });

http.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});