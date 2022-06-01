const express = require('express')
const Joi = require('joi')
    //
const router = express.Router()
    //
    // const Product = require('../models/Products.js')

// Routes
// returns all products
// router.get('/', async(req, res) => {
//     const allProducts = await Product.find()
//     try {
//         res.json(allProducts)
//     } catch (error) {
//         console.log(error)
//         res.json(error)
//     }
// })

// // creates a new product
// router.post('/', async(req, res) => {
//     const product = new Product({
//         product_name: req.body.product_name,
//         description: req.body.description,
//         address: req.body.address,
//         product_details: req.body.product_details,
//         contact_info: req.body.contact_info,
//         product_image_details: req.body.product_image_details,
//         product_category: req.body.product_category,
//     })

//     const savedProduct = await product.save()

//     try {
//         res.json(savedProduct)
//     } catch (error) {
//         console.log(error)
//         res.json(error)
//     }
// })

// // get specific post
// router.get('/:product_id', async(req, res) => {
//     const singleProduct = await Product.findById(req.params.product_id)

//     try {
//         res.json(singleProduct)
//     } catch (error) {
//         res.json(error)
//     }
// })

// // delete specific product
// router.delete('/:product_id', async(req, res) => {
//     const deletedProduct = await Product.findByIdAndRemove(req.params.product_id)

//     try {
//         res.json(deletedProduct)
//     } catch (error) {
//         res.json(error)
//     }
// })

// // update specific product
// router.patch('/:product_id', async(req, res) => {
//     const updatedProduct = await Product.updateOne({ _id: req.params.product_id }, {
//         $set: {
//             product_name: req.body.product_name,
//             description: req.body.description,
//             address: req.body.address,
//             product_details: req.body.product_details,
//             contact_info: req.body.contact_info,
//             product_category: req.body.product_category,
//             product_image_details: req.body.product_image_details,
//         },
//     }, )

//     try {
//         res.json(updatedProduct)
//     } catch (error) {
//         res.json(error)
//     }
// })

// Functions to validate product models before upload and validate a single product with it's ID

const validateProduct = (product) => {
        const joiSchema = Joi.object({
            product_name: Joi.string().min(3).max(80).required().messages({
                'string.base': `"product_name" should be a "String"`,
                'string.empty': `"product_name" cannot be an empty field`,
                'string.min': `"product_name" should have a minimum length of {#limit}`,
                'string.max': `"product_name" should have a maximum length of {#limit}`,
                'any.required': `"product_name" is a required field`,
            }),
            description: Joi.string().min(15).max(500).required().messages({
                'string.base': `"description" should be a "String"`,
                'string.empty': `"description" cannot be an empty field`,
                'string.min': `"description" should have a minimum length of {#limit}`,
                'string.max': `"description" should have a maximum length of {#limit}`,
                'any.required': `"description" is a required field`,
            }),
            address: Joi.object({
                postal_code: Joi.required(),
                location: Joi.string().required().messages({
                    'string.base': `"location" should be a "String"`,
                    'string.empty': `"location" cannot be an empty field`,
                    'any.required': `"location" is a required field`,
                }),
                state: Joi.string().required().messages({
                    'string.base': `"state" should be a "String"`,
                    'string.empty': `"state" cannot be an empty field`,
                    'any.required': `"state" is a required field`,
                }),
                country: Joi.string().required().messages({
                    'string.base': `"country" should be a "String"`,
                    'string.empty': `"country" cannot be an empty field`,
                    'any.required': `"country" is a required field`,
                }),
            }),
            product_category: Joi.object({
                category: Joi.string().required().messages({
                    'string.base': `"category" should be a "String"`,
                    'string.empty': `"category" cannot be an empty field`,
                    'any.required': `"category" is a required field`,
                }),
                type: Joi.string().required().messages({
                    'string.base': `"type" should be a "String"`,
                    'string.empty': `"type" cannot be an empty field`,
                    'any.required': `"type" is a required field`,
                }),
            }),
            product_details: Joi.object({
                quantity: Joi.number().min(1).max(50000).integer().required().messages({
                    'number.base': `"quantity" should be a "Number"`,
                    'number.empty': `"quantity" cannot be an empty field`,
                    'number.min': `"quantity" should have be less than {#limit}`,
                    'number.max': `"quantity" should have be more than {#limit}`,
                    'any.required': `"quantity" is a required field`,
                }),
                price: Joi.number().integer().required().messages({
                    'number.base': `"price" should be a "Number"`,
                    'number.empty': `"price" cannot be an empty field`,
                    'number.positive': `"price" should have a positive value`,
                    'number.greater': `"price" should have be at least one(1)`,
                    'any.required': `"price" is a required field`,
                }),
                production_date: Joi.string().required().messages({
                    'string.base': `"production_date" should be a "String"`,
                    'string.empty': `"production_date" cannot be an empty field`,
                    'any.required': `"production_date" is a required field`,
                }),
                expiry_date: Joi.string().required().messages({
                    'string.base': `"expiry_date" should be a "String"`,
                    'string.empty': `"expiry_date" cannot be an empty field`,
                    'any.required': `"expiry_date" is a required field`,
                }),
                rating: Joi.number().min(1).max(5),
            }),
            product_image_details: Joi.object({
                src: Joi.string().required().messages({
                    'string.base': `"src" should be a "String"`,
                    'string.empty': `"src" cannot be an empty field`,
                    'any.required': `"src" is a required field`,
                }),
                size: Joi.number().integer().required(),
                name: Joi.string().required().messages({
                    'string.base': `"name" should be a "String"`,
                    'string.empty': `"name" cannot be an empty field`,
                    'any.required': `"name" is a required field`,
                }),
                type: Joi.string().required().messages({
                    'string.base': `"type" should be a "String"`,
                    'string.empty': `"type" cannot be an empty field`,
                    'any.required': `"type" is a required field`,
                }),
            }),
            contact_info: Joi.object({
                phone: Joi.string().required(),
                // phone: Joi.string().regex(/^\d{4}-\d{3}-\d{4}$/).required(),
                // email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
                email: Joi.string().pattern(new RegExp(/.+@.+\..+/)),
                website_url: Joi.string(),
                website_title: Joi.string(),
            }),
        })
        return joiSchema.validate(product)
    }
    //
    // const validateProductWithId = (req, res) => {
    //     const product = Product.find(
    //             (product) => product._id === parseInt(req.params.product_id),
    //         )
    //         // Check if that product exist or not
    //     console.log(product)
    //     if (!product)
    //         return res
    //             .status(404)
    //             .send(
    //                 `The product with architectId of "${req.params.product_id}" was not found`,
    //             )
    //     return product
    // }

module.exports = router