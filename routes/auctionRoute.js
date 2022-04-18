const router = require('express').Router();
let Auction = require('../models/auction.models');
const {upload} = require('../filehelper/filehelper')

router.route('/:id').get((req,res)=> {
    Auction.findById(req.params.id)
    .then(auction=>res.json(auction))
    .catch(err=>res.status(400).json('Error' + err));
});

router.route('/add_auction').post((req, res) => {
    const auction = new Auction(req.body)
    auction.save()
    .then((result) => {
        res.json('Product added')
    })
});

router.route('/:id').get((req,res)=> {
    Auction.findById(req.params.id)
   .then(auction=>res.json(auction))
   .catch(err=>res.status(400).json('Error' + err));
});

router.route('/updateAuction/:id').put(function(req,res){
    Auction.findByIdAndUpdate(req.params.id,req.body)
    .then(auction=>res.json(auction))
    .catch(err=>res.status(400).json('Error' + err));
})

router.route('/deleteAuction/:id').delete((req,res)=> {
    Auction.findByIdAndRemove(req.params.id)
   .then(auction=>res.json(auction))
   .catch(err=>res.status(400).json('Error' + err));
});

router.route('/all').get((req, res) => {
    Product.find()
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        res.json(err)
    })
})

router.route('/add-product').post(upload.single('productImage'),(req, res) => {
    const auction  = new Auction({"productImage":req.file.path,"userId":req.body.userId,"productName":req.body.productName,"productDescription":req.body.productDescription,"productPrice":req.body.productPrice,"startDate":req.body.startDate,"endDate":req.body.endDate,"status":"upcoming","Bid":req.body.productPrice})
    auction.save()
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


module.exports = router;