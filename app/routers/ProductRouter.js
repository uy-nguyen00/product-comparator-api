const productRouter = require('express').Router();
const productController = require("../controllers/ProductController");
const userController = require("../controllers/UserController");


productRouter.get('/all', productController.readAll);

productRouter.get('/:id', productController.read);

productRouter.post('/:id/create-update', userController.authenticate(), productController.createUpdate);

productRouter.post('/:id/delete', userController.authenticate(), productController.deleteProduct);

productRouter.post('/:p1/:p2', productController.compareProducts);

module.exports = productRouter;