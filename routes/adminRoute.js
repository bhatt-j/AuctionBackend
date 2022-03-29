const router = require('express').Router();
let Admin = require('../models/admin');

router.route('/get_admin').post((req,res)=> {
    Admin.find({'username': req.body.username}, (err, docs) => {
        res.json(docs);
    })
})

router.route('/add_admin').post((req, res) => {
    const admin = new Admin(req.body)
    admin.save()
    .then((result) => {
        res.json('Admin added')
    })
})

router.route('/:id').get((req,res)=> {
    Admin.findById(req.params.id)
   .then(admin=>res.json(admin))
   .catch(err=>res.status(400).json('Error' + err));
});

router.route('/updateAdmin/:id').put(function(req,res){
    Admin.findByIdAndUpdate(req.params.id,req.body)
    .then(admin=>res.json(admin))
    .catch(err=>res.status(400).json('Error' + err));
})

router.route('/deleteAdmin/:id').delete((req,res)=> {
    Admin.findByIdAndRemove(req.params.id)
   .then(admin=>res.json(admin))
   .catch(err=>res.status(400).json('Error' + err));
});

module.exports = router;