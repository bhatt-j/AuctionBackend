const router = require('express').Router();
const wallet = require('../models/wallet');
let Wallet = require('../models/wallet');

router.route('/get_wallet').post((req,res)=> {
    Wallet.findById(req.params.id)
    .then(wallet=>res.json(wallet))
    .catch(err=>res.status(400).json('Error' + err));
});

router.route('/add_amount').post((req, res) => {
    const wallet = new Wallet(req.body)
    wallet.save()
    .then((result) => {
        res.json('Money added to user wallet')
    })
});

router.route('/:id').get((req,res)=> {
    Wallet.findById(req.params.id)
   .then(wallet=>res.json(wallet))
   .catch(err=>res.status(400).json('Error' + err));
});

router.route('/updateWallet/:id').put(function(req,res){
    Wallet.findByIdAndUpdate(req.params.id,req.body)
    .then(wallet=>res.json(wallet))
    .catch(err=>res.status(400).json('Error' + err));
})

router.route('/deleteWallet/:id').delete((req,res)=> {
    Wallet.findByIdAndRemove(req.params.id)
   .then(wallet=>res.json(wallet))
   .catch(err=>res.status(400).json('Error' + err));
});

module.exports = router;