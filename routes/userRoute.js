const router = require('express').Router();
let User = require('../models/user');
const Token = require('../models/token');
const crypto = require("crypto");
const mail = require('nodemailer');
const wallet=require('../models/wallet')

//bcrypt
const bcrypt=require('bcryptjs')

//responses
const responses=require("../utils/responses")

//validations
const validation=require('../validations/register.validation');
const { json } = require('express');


//nodemailer initialize
let transporter = mail.createTransport({
  service: "gmail",
  auth: {
      user: "projectauction12@gmail.com",
      pass: "auction12"
  }
})

transporter.verify((err, success) => {
  if(err)
  {
      console.log(err);
  }
  else{
      console.log('ready to send emails!');
      console.log(success);
  }
})




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

        //
        const userid = new_user._id;
        console.log(userid);
        const token = await Token.findOne({ userid: new_user._id });
        if (token) { 
              await token.deleteOne()
        };

        let resetToken = crypto.randomBytes(32).toString("hex");

        await new Token({
          userid: userid,
          token: resetToken,
          createdAt: Date.now(),
        }).save();
        const link = `https://localhost:4000/user/verify-account/${resetToken}/${userid}`;
        console.log(link);

        const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: new_user.email,
          subject: "Auction Project - Verify Email To Continue",
          html: `
          <body>
          <h1>Verify Your Email </h1>
          <hr>
          <h3>Important: This link will be valid for only 1 Hour! </h3>
          <p> Click <a href=${link}>here</a> to verify your account. </p>
          <hr>
          <p>Regards,</p>
          <p>Team Auction Project </p>
          </body>
          `
        }
      
        transporter.sendMail(mailOptions)
          .then(() => {
              console.log("Mail Sent!")
          })
          .catch((err) => {
              console.log(err);
          });
      

        //

        return responses.successfullyCreatedResponse(res, new_user)
        

      } catch (error) {
        console.log(error)
        return responses.serverErrorResponse(res)
      }
});

router.route('/login').post(async (req,res)=> {
  //console.log('hello');
  User.findOne({email:req.body.email})
  .then(user=>{
    console.log(user);
    if(!user)
      return res.status(404).json({error:"No user found"})
    else{
      if(user.isVerified)
      { 
        bcrypt.compare(req.body.password,user.password,(error,result)=>{
          if(error)
            return res.status(500).json(error)
          else if(result)
            return res.status(200).json(user)
          else
            return res.status(403).json({error:"Password is incorrect"})
        })
      }
      else{
        return res.json("Please Verify Your Account Before Logging In.")
      }
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

router.route('/verify-account/:token/:userid').get( async (req, res) => {
  const token = await Token.findOne({ token : req.params.token })
  if(token)
  {
      const user = await User.findOne({ userId : req.params.userid })
      if(user)
      {
          const update = await User.updateOne({ _id : req.params.userid }, {isVerified : true})
          if(update)
          {
              // const wallet1=await (await wallet).create;
              // wallet1.userId=(req.params.userid);
              // wallet1.amount=0;
              const wallet1=new wallet({"userId":req.params.userid,"amount":0 })
              wallet1.save()
             .then((result) => {
                 res.json("Wallet Added")
              })
          }
          else{
            res.json("error verifying account")
          }
      }
  }
})

router.route('/reset-password/:token/:userid').post( async (req, res) => {
  const newpass = req.body.newpassword;
  console.log("token: " + req.params.token + " " + "userid: " + req.params.userid)
  console.log("new password recieved" + newpass);
  const token = await Token.findOne({ token : req.params.token })
    if(token)
    {
        const user = await User.findOne({ userId : req.params.userid })
        if(user)
        {
            const update = await User.updateOne({ _id : req.params.userid }, {password : newpass})
            if(update)
            {
                res.json("password changed successfully")
                
            }
        }
    }
})


router.route('/forgot-password').post( async (req, res) => {
  const email = req.body.email;
  let userid;
  console.log("email recieved: " + email)
  const user = User.findOne({email})
  .then((result) => {
    if(result == null)
    {
      res.json("user not found");
    }
    else{
      userid = result._id;
      //res.json("user exists")
    }
  })

  const token = await Token.findOne({ _id: user._id });
  if (token) { 
        await token.deleteOne()
  };

  let resetToken = crypto.randomBytes(32).toString("hex");

  await new Token({
    userid: userid,
    token: resetToken,
    createdAt: Date.now(),
  }).save();

  const link = `https://localhost:4000/user/reset-password/${resetToken}/${userid}`;
  console.log(link)

  const currentUrl = "https://localhost:4000/";

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Auction Project - Change Password Request",
    html: `
    <body>
    <h1>Reset Password Request </h1>
    <hr>
    <h3>Important: This link will be valid for only 1 Hour! </h3>
    <p> Click <a href=${link}>here</a> to change your password. </p>
    <hr>
    <p>Regards,</p>
    <p>Team Auction Project </p>
    </body>
    `
  }

  transporter.sendMail(mailOptions)
    .then(() => {
        res.json("Mail Sent!")
    })
    .catch((err) => {
        res.json(err);
    });





  
})

module.exports = router;