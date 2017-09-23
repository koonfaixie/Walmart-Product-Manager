const Product = require('../models').product;

// create a new model if search variables get too large
const QUERY_LIST = {
  'cereal': 'cereal',
  'cold cereal': 'cold_cereal',
}

module.exports = {
  retrieve(req, res, next) {
    console.log(req.query.query, req.query.day)
    if (req.query.query && req.query.day) {
      let _query = QUERY_LIST[req.query.query.toLowerCase()]
      if (_query) {
        let filter_params = {day: parseInt(req.query.day)};
        filter_params[_query] = true;
        Product.findAll({where: filter_params, order: [_query+'_order']})
        .then((products) => {
          if (!products) {
            return res.status(404).send({
              error: 'No products found'
            });
          }
          return res.status(200).send(products)
        })
        .catch(error => res.status(400).send(error));
      } else {
        Product.findAll({where:{day: parseInt(req.query.day)}}).then((products) => {
          if (!products) {
            return res.status(404).send({
              error: 'No products found'
            });
          }
          return res.status(200).send(products)
        })
        .catch((error) => res.status(400).send(error));
      }
    } else {
      return res.status(400);
    }
  },
  update(req, res, next) {
    console.log(req.body)
    return Product
      .findOne({where: {item_id: parseInt(req.body.product_id)}})
      .then((product) => {
        if (!product) {
          return res.status(404).send({
            error: 'Product not found',
          });
        }
        return product
        .update({
          brand: req.body.brand,
        })
        .then(() => res.status(200).send({success: product})) //send by the updated product
        .catch((error) => res.status(400).send(error))
      })
      .catch((error) => res.status(400).send(error));
  },
};
