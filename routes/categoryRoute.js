
const router = require('express').Router();
let Category = require('../models/category.models');

router.route('/:id').get((req,res)=> {
    Category.findById(req.params.id)
    .then(chat=>res.json(chat))
    .catch(err=>res.status(400).json('Error' + err));
});

router.route('/add_category').post((req, res) => {
    const category = new Category(req.body)
    category.save()
    .then((result) => {
        res.json('Category added')
    })
});

router.route('/:id').get((req,res)=> {
    Category.findById(req.params.id)
   .then(category=>res.json(category))
   .catch(err=>res.status(400).json('Error' + err));
});

router.route('/updateCategory/:id').put(function(req,res){
    Category.findByIdAndUpdate(req.params.id,req.body)
    .then(category=>res.json(category))
    .catch(err=>res.status(400).json('Error' + err));
})

router.route('/deleteCategory/:id').delete((req,res)=> {
    Category.findByIdAndRemove(req.params.id)
   .then(category=>res.json(category))
   .catch(err=>res.status(400).json('Error' + err));
});

module.exports = router;