const express = require('express')
    //
const router = express.Router()
    //
const ProductTest = require('../models/ProductTest.js')
const Post = require('../models/posts/Posts')

// Routes
// returns all products
router.get('/', async(req, res) => {
    console.log(req)
    const allProducts = await ProductTest.find()
    try {
        res.json(allProducts)
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

// creates a new productTest
router.post('/', async(req, res) => {
    // console.log(req.params)
    try {
        const productTest = new ProductTest({
            name: req.body.name,
            test1: req.body.test1,
            test2: req.body.test2,
            related_posts: [{
                post_id: req.body.post_id,
            }, ],
        })

        const savedProduct = await productTest.save()
        res.json(savedProduct)
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

// get specific post
router.get('/:product_id', async(req, res) => {
    const singleProduct = await ProductTest.findById(req.params.product_id)

    try {
        res.json(singleProduct)
    } catch (error) {
        res.json(error)
    }
})

module.exports = router