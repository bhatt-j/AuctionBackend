const router = require('express').Router();
let User = require('../models/user');

router.route('/all').get((req, res) => {
    User.find()
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {console.log(err)})
});

router.route('/add-user').post((req, res) => {
    console.log(req.body);
    const user = new User(req.body)
    user.save()
    .then((result) => {
        res.json('User Added')
    })
});

router.route('/:id').get((req,res)=> {
    User.findById(req.params.id)
   .then(user=>res.json(user))
   .catch(err=>res.status(400).json('Error' + err));
});

router.route('/updateUser/:id').put(function(req,res){
    User.findByIdAndUpdate(req.params.id,req.body)
    .then(user=>res.json(user))
    .catch(err=>res.status(400).json('Error' + err));
})

router.route('/deleteUser/:id').delete((req,res)=> {
    User.findByIdAndRemove(req.params.id)
   .then(user=>res.json(user))
   .catch(err=>res.status(400).json('Error' + err));
});

module.exports = router;