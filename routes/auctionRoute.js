const router = require('express').Router();
let Auction = require('../models/auction.models');

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

module.exports = router;