const router = require('express').Router();
const transaction = require('../models/transaction');
let Transaction = require('../models/transaction');
let wallet = require('../models/wallet');
let Auction = require('../models/auction.models')

router.route('/get_transaction/:id').get((req,res)=> {
    Transaction.find({"bidderId":req.params.id})
    .then(transaction=>res.json(transaction))
    .catch(err=>res.status(400).json('Error' + err));
});

router.route('/add_transaction').post((req, res) => {
    var amt;
    console.log(req.body)
    const transaction = new Transaction(req.body)
    transaction.save()
    .then((result) => {
        wallet.findOne({userId:req.body.sellerId})
        .then(walletobj=>{
            console.log("seller Amount "+walletobj.amount)
            amt=walletobj.amount+req.body.amount;
            wallet.findOneAndUpdate({userId:req.body.sellerId},{$set:{"amount":amt}},{new: true})
            .then(res=>
            {
                console.log("seller Updated "+res.amount)
            })
            .catch(err=>res.status(400).json('Error' + err));
        })
        .catch(err=>{return res.status(400).json('Error' + err)});

        wallet.findOne({userId:req.body.bidderId})
        .then(walletobj=>{
            console.log("Bidder Amount "+walletobj.amount)
            amt=walletobj.amount-req.body.amount;

            wallet.findOneAndUpdate({userId:req.body.bidderId},{"amount": amt},{new: true})
            .then((res)=>{
                console.log("Bidder Updated "+res.amount)
            })
            .catch(err=>{return res.status(400).json('Error' + err)});
        })
        .catch(err=>{return res.status(400).json('Error' + err)});

        //update to complete
        Auction.findByIdAndUpdate(req.body.auctionId,{status:"completed"})
        .catch(err=>res.status(400).json('Error' + err));

        return res.json('Transaction added')
    })
});

router.route('/:id').get((req,res)=> {
    Transaction.findById(req.params.id)
   .then(transaction=>res.json(transaction))
   .catch(err=>res.status(400).json('Error' + err));
});

router.route('/updateTransaction/:id').put(function(req,res){
    Transaction.findByIdAndUpdate(req.params.id,req.body)
    .then(transaction=>res.json(transaction))
    .catch(err=>res.status(400).json('Error' + err));
})

router.route('/deleteTransaction/:id').delete((req,res)=> {
    User.findByIdAndRemove(req.params.id)
   .then(transaction=>res.json(transaction))
   .catch(err=>res.status(400).json('Error' + err));
});

module.exports = router;