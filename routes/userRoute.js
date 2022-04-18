const router = require('express').Router();
let User = require('../models/user');

//bcrypt
const bcrypt=require('bcryptjs')

//responses
const responses=require("../utils/responses")

//validations
const validation=require('../validations/register.validation');
const { json } = require('express');

router.route('/all').get((req, res) => {
    User.find()
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {console.log(err)})
});

router.route('/register').post(async (req, res) => {
    try {
        let validate = await validation(req.body);
    
        if (validate.error) {
          return responses.badRequestResponse(
            res,
            validate.error.details[0].message
          );
        }
    
        let user =await User.findOne({
          $or: [
            {
              mobileNumber: req.body.mobile
            }, {
              email: req.body.email
            }
          ]
        })
        console.log(user)
        if (user) {
          return responses.badRequestResponse(res, { err: "user Already exists." })
        }
        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash_password
    
        let new_user = await User.create(req.body)
        if (!new_user) {
          return responses.serverErrorResponse(res, "Error while creating user.")
        }
        return responses.successfullyCreatedResponse(res, new_user)
      } catch (error) {
        console.log(error)
        return responses.serverErrorResponse(res)
      }
});

router.route('/login').get((req,res)=> {
  User.findOne({email:req.body.email})
  .then(user=>{
    if(!user)
      res.status(404).json({error:"No user found"})
    else{
      bcrypt.compare(req.body.password,user.password,(error,result)=>{
        if(error)
          res.status(500).json(error)
        else if(result)
          res.status(200).json(user)
        else
          res.status(403).json({error:"Password is incorrect"})
      })
    }
  })
 .catch(error=>{
   res.status(500).json(error)
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