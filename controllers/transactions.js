const db = require('../models');
const Transaction = db.Transaction;

const createTransaction = async (req, res) => {
  console.log("TESTING");
  console.log(req.body);
  const { message, subscription } = req.body;
  console.log(message);
  const data = message.data;
  const publishTime = message.publishTime;
  const publishtime = new Date(publishTime);

  // DECODE
  const decodedData = Buffer.from(data, 'base64').toString('utf-8');

  // AQUI: VALIDAR LEN DE decodedData

  const operacion = decodedData.slice(0, 4);
  const id_mensaje = decodedData.slice(4, 14);
  const banco_origen = decodedData.slice(14, 21);
  const cuenta_origen = decodedData.slice(21, 31);
  const banco_destino = decodedData.slice(31, 38);
  const cuenta_destino = decodedData.slice(38, 48);
  const monto = decodedData.slice(48, 64);

  // AQUI: VALIDAR TIPO DE OPERACION PERMITIDA

  // AQUI: VALIDAR MONTO PERMITIDO (mayor que cero)
  console.log("DATOS");
  console.log(operacion);
  console.log(id_mensaje);
  console.log(banco_origen);
  console.log(cuenta_origen);
  console.log(banco_destino);
  console.log(cuenta_destino);
  console.log(monto);
  console.log(publishTime);
  console.log(publishtime);


  try {
    // check if the order already exist
    const existingTransaction = await Transaction.findOne({ where: { id_mensaje: id_mensaje } });
    if (existingTransaction) {
      console.log("Transaccion duplicada");
      return res.status(400).json({ mensaje: 'OC ya fue recibida' });
    }
    // create a new order
    console.log("Crear Transaccion");
    const transaccion = await Transaction.create({
      operacion,
      id_mensaje,
      banco_origen,
      cuenta_origen,
      banco_destino,
      cuenta_destino,
      monto,
      publishtime,
    });

    console.log("STATUS 200");
    res.status(200).end(); // ACKNOWLEDGMENT
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Server error' });
  }

};


//  2200162571672400009480000006310002554800000373570000000000056300         total: 64

module.exports = {
    createTransaction,
  };