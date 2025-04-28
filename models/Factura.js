const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
    numero_factura: { type: String, required: true }, // <-- Nuevo campo
    cliente: { type: String, required: true },
    articulos: [{ 
        nombre: { type: String, required: true },
        cantidad: { type: Number, required: true },
        precio: { type: Number, required: true },
        total: { type: Number, required: true }
    }],
    notas: { type: String },
    fecha: { type: Date, default: Date.now },
    total_general: { type: Number, required: true },
    abonos: [{
        monto: { type: Number, required: true },
        fecha_abono: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Factura', facturaSchema);

