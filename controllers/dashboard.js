const express = require('express');
const router = express.Router();
const db = require('../models');
const Transaction = db.Transaction;
const { Op } = require('sequelize');
const { sequelize } = require('../models/index');
const moment = require('moment');
const config = require('../config/config.json');

const showDashboard = async (req, res) => {
    const { banco_origen, banco_destino, year, month, day } = req.query;

    
    //let fecha;
  
    let filters = {};
    let filtro_solo_fecha = {};
    if (banco_origen) {
      filters.banco_origen = banco_origen;
    }
    if (banco_destino) {
      filters.banco_destino = banco_destino;
    }

    if (year) {
      filters.publishtime = {
        [Op.between]: [year + '-01-01 00:00:00.000+00', year + '-12-31 23:59:59.999+00'],
      };
      filtro_solo_fecha.publishtime = {
        [Op.between]: [year + '-01-01 00:00:00.000+00', year + '-12-31 23:59:59.999+00'],
      };
    }
    if (month) {
      filters.publishtime = {
        [Op.between]: [year + '-' + month + '-01 00:00:00.000+00', year + '-' + month + '-31 23:59:59.999+00'],
      };
      filtro_solo_fecha.publishtime = {
        [Op.between]: [year + '-' + month + '-01 00:00:00.000+00', year + '-' + month + '-31 23:59:59.999+00'],
      };
    }
    if (day) {
      filters.publishtime = {
        [Op.between]: [year + '-' + month + '-' + day + ' 00:00:00.000+00', year + '-' + month + '-' + day + ' 23:59:59.999+00'],
      };
      filtro_solo_fecha.publishtime = {
        [Op.between]: [year + '-' + month + '-' + day + ' 00:00:00.000+00', year + '-' + month + '-' + day + ' 23:59:59.999+00'],
      };
    }


    const distinctOrigenBanks = await Transaction.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('banco_origen')), 'banco_origen']],
        raw: true,
      });
      
      const distinctDestinoBanks = await Transaction.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('banco_destino')), 'banco_destino']],
        raw: true,
      });
  
    const totalOperaciones = await Transaction.count({ where: filters });

    const totalOperaciones_2200 = await Transaction.count({ where: {operacion: '2200', ...filters} });

    const totalOperaciones_2400 = await Transaction.count({ where: {operacion: '2400', ...filters} });

    const montoOperaciones_2200 = await Transaction.sum('monto', { where: {operacion: '2200', ...filters} });

    const montoOperaciones_2400 = await Transaction.sum('monto', { where: {operacion: '2400', ...filters} });


    const last100Transactions = await Transaction.findAll({
        where: filters,
        limit: 100,
        order: [['publishtime', 'DESC']],
      });
    
      const histogramData = await Transaction.findAll({
        where: filters,
        attributes: [
          'banco_origen',
          'banco_destino',
          [
            sequelize.literal(`CASE
              WHEN monto < 10000 THEN 'Under 10000'
              WHEN monto >= 10000 AND monto <= 49999 THEN '10000 - 49999'
              WHEN monto >= 50000 AND monto <= 99999 THEN '50000 - 99999'
              WHEN monto >= 100000 AND monto <= 499999 THEN '100000 - 499999'
              WHEN monto >= 500000 AND monto <= 999999 THEN '500000 - 999999'
              WHEN monto >= 1000000 AND monto <= 9999999 THEN '1000000 - 9999999'
              WHEN monto > 9999999 THEN 'Over 9999999'
              END`),
            'amountCategory'
          ],
          [
            sequelize.fn('COUNT', sequelize.col('id')),
            'transactionCount'
          ],
        ],
        group: ['banco_origen', 'banco_destino', 'amountCategory'],
      });



  // Bank reconciliation calculations
  const add2200 = await Transaction.sum('monto', {
    where: {
      operacion: '2200',
      banco_origen: banco_destino,
      banco_destino: banco_origen,
      ...filtro_solo_fecha,
    },
  });

  const subtract2200 = await Transaction.sum('monto', {
    where: {
      operacion: '2200',
      banco_origen: banco_origen,
      banco_destino: banco_destino,
      ...filtro_solo_fecha,
    },
  });

  const add2400 = await Transaction.sum('monto', {
    where: {
      operacion: '2400',
      banco_origen: banco_origen,
      banco_destino: banco_destino,
      ...filtro_solo_fecha,
    },
  });

  const subtract2400 = await Transaction.sum('monto', {
    where: {
      operacion: '2400',
      banco_origen: banco_destino,
      banco_destino: banco_origen,
      ...filtro_solo_fecha,
    },
  });

  const conciliacion = add2200 - subtract2200 + add2400 - subtract2400;

  const conciliacion_inversa = -conciliacion;


      console.log("totalOperaciones");
      console.log(totalOperaciones);
      console.log("histogramData");
      console.log(histogramData);

      res.render('dashboard', { distinctOrigenBanks, distinctDestinoBanks, totalOperaciones, transactions: last100Transactions, histogramData, 
        add2200,
        subtract2200,
        add2400,
        subtract2400,
        conciliacion,
        conciliacion_inversa,
        banco_origen,
        banco_destino,
        totalOperaciones_2200,
        totalOperaciones_2400,
        montoOperaciones_2200,
        montoOperaciones_2400
      });
    };
  
  
  
  
  
  
  

module.exports = {
  showDashboard,
};

