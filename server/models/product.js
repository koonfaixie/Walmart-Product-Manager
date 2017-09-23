'use strict';

// Have to Optimize Schema, create more tables.
// Maybe product can be one and then prices/msrp/reviews can be
// under another table because they depend on day and time.
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('product', {
    item_id: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    brand: DataTypes.STRING,
    category: DataTypes.STRING,
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    msrp: DataTypes.FLOAT,
    review_score: DataTypes.FLOAT,
    review_count: DataTypes.INTEGER,
    cereal: DataTypes.BOOLEAN,
    cold_cereal: DataTypes.BOOLEAN,
    day: DataTypes.INTEGER,
    cereal_order: DataTypes.INTEGER,
    cold_cereal_order: DataTypes.INTEGER,
  }, {
    timestamps: false
  });
  return Product;
};
