// Importa las dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser'); // Usaremos body-parser para obtener los datos del formulario
const mongoose = require('mongoose');
const Factura = require('./models/Factura'); // Importar el modelo de factura


const app = express();
const port = 3000;



// Conectar a MongoDB (reemplaza con tu URI de MongoDB Atlas)
mongoose.connect('mongodb+srv://hectorem13:gVKUu0LIPs8Ps6dW@cluster0.k1txigc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conexión a MongoDB exitosa');              
}).catch((err) => {
  console.error('Error al conectar con MongoDB:', err);
});


// Configura el motor de plantillas (EJS)
app.set('view engine', 'ejs');
app.set ('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (como imágenes, CSS)
app.use(express.static('public'));

// Usar body-parser para procesar datos de formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para mostrar el formulario
// Ruta para mostrar el formulario
app.get('/dashboard', async (req, res) => {
    try {
        const facturas = await Factura.find(); // Buscar las facturas en la base de datos
        res.render('dashboard', { facturas }); // Enviar facturas a la vista
    } catch (err) {
        console.error('Error obteniendo las facturas:', err);
        res.status(500).send('Error cargando dashboard');
    }
});

app.get('/nueva_factura', (req, res) => {
    res.render('nueva_factura'); // Renderiza la vista de la factura
}
);     




// Ruta para guardar la factura
app.post('/facturas', async (req, res) => {
    try {
        const datos = req.body;

        let articulos = datos.articulos;

        // Si solo agregaron 1 artículo, convertirlo a array
        if (!Array.isArray(articulos)) {
            articulos = [articulos];
        }

        // Ahora sí mapeamos bien
        const articulosProcesados = articulos.map(art => ({
            nombre: art.nombre,
            cantidad: parseInt(art.cantidad),
            precio: parseFloat(art.precio),
            total: parseFloat(art.precio) * parseInt(art.cantidad)
        }));

        // Calcular total general
        const total_general = articulosProcesados.reduce((acc, item) => acc + item.total, 0);

        const nuevaFactura = new Factura({
            numero_factura: datos.numero_factura,
            cliente: datos.cliente,
            articulos: articulosProcesados,
            notas: datos.notas,
            total_general: parseFloat(req.body.total_general)
        });

        await nuevaFactura.save();
        res.send('Factura guardada correctamente ✅');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar la factura ❌');
    }
});


// Puerto
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000/dashboard');
});