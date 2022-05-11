const router = require('express').Router();
let Admin = require('../models/admin');

router.route('/admin_login').post(async (req,res)=> {
    //console.log('hello');
    Admin.findOne({email:req.body.email})
    .then(async user=>{
      if(!user)
        return res.status(404).json({error:"No user found"})
      else{
        if(user.password==req.body.password)
            return res.status(200).json(user);
        else{
          return res.status(403).json({error:"Password is incorrect"})
        }
      }
    })
   .catch(error=>{
     res.status(500).json(error)
   })
  });

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