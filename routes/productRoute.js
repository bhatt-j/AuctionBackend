const router = require('express').Router();
const product = require('../models/product');
let Product = require('../models/product');

router.route('/all').get((req, res) => {
    Product.find()
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        res.json(err)
    })
})

router.route('/add-product').post((req, res) => {
    const product = new Product(req.body)
    product.save()
    .then((result) => {
        res.json("Product Added")
    })
});

router.route('/:id').get((req,res)=> {
    Product.findById(req.params.id)
   .then(product=>res.json(product))
   .catch(err=>res.status(400).json('Error' + err));
});

router.route('/updateProduct/:id').put(function(req,res){
    Product.findByIdAndUpdate(req.params.id,req.body)
    .then(product=>res.json(product))
    .catch(err=>res.status(400).json('Error' + err));
})

router.route('/deleteProduct/:id').delete((req,res)=> {
    Product.findByIdAndRemove(req.params.id)
   .then(product=>res.json(product))
   .catch(err=>res.status(400).json('Error' + err));
});

module.exports = router