const {
    Model,
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
      }
    }
    Transaction.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      operacion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_mensaje: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      banco_origen: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cuenta_origen: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      banco_destino: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cuenta_destino: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      monto: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      publishtime: {
        type: DataTypes.DATE,
        allowNull: false,
       timezone: true,
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Transaction',
    });
    return Transaction;
  };

  /*
INSERT INTO "Transactions" (operacion, id_mensaje, banco_origen, cuenta_origen, banco_destino, cuenta_destino, monto, publishtime)
VALUES (
  '2200',
  '1625716727',
  '0000948',
  '0000006310',
  '0036942',
  '0000037429',
  43000,
  '2023-02-26 19:15:56.749+00'
);
  */