const axiosInstance = require('../../config/restdb/restdb');
const {handleResponse} = require("../handlers/responseHandler");
const {handleError} = require("../handlers/errorHandler");

const collection = 'products';

async function readAll(req, res) {
    try {
        const response = await axiosInstance.get(collection);
        const products = response.data;

        res.status(200).json({products});
    } catch (error) {
        handleError(error, req, res);
    }
}

async function read(req, res) {
    try {
        let response;
        const product = await getById(req.params.id);

        if (product) {
            response = {
                status: 200,
                type: 'product',
                message: product
            }
        } else {
            response = {
                status: 400,
                type: 'error',
                message: 'This product does not exist.'
            }
        }
        handleResponse(response, req, res);
        return product;

    } catch (error) {
        handleError(error, req, res);
    }
}

async function createUpdate(req, res) {
    try {
        let response;
        const product = await getById(req.params.id);

        // Update the existing product
        if (product) {
            const objectId = product._id;
            const requestResponse = await axiosInstance.put(collection + `/${objectId}`, {
                brand: req.body.brand,
                model: req.body.model,
                size: req.body.size,
                width: req.body.width,
                height: req.body.height,
                refreshRate: req.body.refreshRate,
                connectivity: req.body.connectivity,
                image: req.body.image,
                price: req.body.price
            });
            response = {
                status: requestResponse.status,
                type: 'data',
                message: requestResponse.data
            }
            handleResponse(response, req, res);
            return;
        }

        // Check duplicate
        const isDuplicated = await getByBrandAndModel(req.body.brand, req.body.model);
        if (isDuplicated) {
            response = {
                status: 401,
                type: 'error',
                message: 'Product already exists!'
            }
            handleResponse(response, req, res);
            return;
        }

        // Create the new product
        const requestResponse = await axiosInstance.post(collection, {
            id: Number(req.params.id),
            brand: req.body.brand,
            model: req.body.model,
            size: req.body.size,
            width: req.body.width,
            height: req.body.height,
            refreshRate: req.body.refreshRate,
            connectivity: req.body.connectivity,
            image: req.body.image,
            price: req.body.price
        });
        response = {
            status: requestResponse.status,
            type: 'data',
            message: requestResponse.data
        }
        handleResponse(response, req, res);

    } catch (error) {
        handleError(error, req, res);
    }
}

async function deleteProduct(req, res) {
    try {
        const product = await read(req, res);
        if (!product) {
            return;
        }

        const objectId = product._id;
        await axiosInstance.delete(collection + `/${objectId}`);

    } catch (error) {
        handleError(error, req, res);
    }
}

async function compareProducts(req, res) {
    try {
        const product1 = await getById(req.params.p1);
        const product2 = await getById(req.params.p2);

        const result = {
            price: compareSpec(product2.price, product1.price),
            refreshRate: compareSpec(product1.refreshRate, product2.refreshRate),
            size: compareSpec(product1.size, product2.size),
            connectivity: compareSpec(product1.connectivity.length, product2.connectivity.length),
        };

        const response = {
            status: 200,
            type: 'result',
            message: result
        };

        handleResponse(response, req, res);
    } catch (error) {
        handleError(error, req, res);
    }
}

// Private functions
async function getById(id) {
    const response = await axiosInstance.get(collection + `?q={"id":${id}}`);
    return response.data[0];
}

async function getByBrandAndModel(brand, model) {
    const response = await axiosInstance.get(collection + `?q={"brand":"${brand}","model":"${model}"}`);
    return response.data[0];
}

function compareSpec(p1, p2) {
    return Number((p1 / p2).toFixed(2));
}

module.exports = {
    readAll: readAll,
    read: read,
    createUpdate: createUpdate,
    deleteProduct: deleteProduct,
    compareProducts: compareProducts
}