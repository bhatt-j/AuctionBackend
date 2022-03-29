const router = require('express').Router();
const transaction = require('../models/transaction');
let Transaction = require('../models/transaction');

router.route('/get_transaction').post((req,res)=> {
    Transaction.find({'_id': req.body.id}, (err, docs) => {
        res.json(docs);
    })
});

router.route('/add_transaction').post((req, res) => {
    const transaction = new Transaction(req.body)
    transaction.save()
    .then((result) => {
        res.json('Transaction added')
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