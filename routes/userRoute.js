const router = require('express').Router();
let User = require('../models/user');
const Token = require('../models/token');
const crypto = require("crypto");
const mail = require('nodemailer');
require("dotenv/config")
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
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS
  }
})

transporter.verify((err, success) => {
  if(err)
  {
      console.log(err);
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
        if (user) {
          return responses.badRequestResponse(res, { err: "user Already exists." })
        }
        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash_password

        req.body.avtar="uploads\\profile_pic.png";

        let new_user = await User.create(req.body)
        if (!new_user) {
          return responses.serverErrorResponse(res, "Error while creating user.")
        }

        //
        const userid = new_user._id;
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
        const link = `http://localhost:3000/user/verify-account/${resetToken}/${userid}`;

        const mailOptions = {
          from: process.env.EMAIL_ID,
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
          .catch((err) => {
              console.log(err);
          });
//

        return responses.successfullyCreatedResponse(res, new_user)

      } catch (error) {
        return responses.serverErrorResponse(res)
      }
});

router.route('/login').post(async (req,res)=> {
  //console.log('hello');
  User.findOne({email:req.body.email})
  .then(async user=>{
    if(!user)
      return res.status(404).json({error:"No user found"})
    else{
      let result = await bcrypt.compare(req.body.password,user.password);
      if(!result){
        return res.status(403).json({error:"Password is incorrect"})
      }
      else{
        if(user.isVerified)
        {
          return res.status(200).json(user);
        }
        else{
          return res.json({error:"Please Verify Your Account Before Logging In."})
        }
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

router.route('/updateUser/:id').put(async function(req,res){
    if(req.body.password){
      const salt = await bcrypt.genSalt(10);
      const hash_password = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash_password;
    }
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
      const user = await User.findOne({ _id : req.params.userid })
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
  let newpass = req.body.newpassword;
  const salt = await bcrypt.genSalt(10);
      const hash_password = await bcrypt.hash(newpass, salt);
      newpass = hash_password;
    const token = await Token.findOne({ token : req.params.token })
    if(token)
    {
        const user = await User.findOne({ _id : req.params.userid })
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
  const user = User.findOne({email})
  .then(async (result) => {
    if(result == null)
    {

      return res.json("user not found");
    }
    else{
      userid = result._id;
      //res.json("user exists")
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

  const link = `http://localhost:3000/user/reset-password/${resetToken}/${userid}`;

  const currentUrl = "http://localhost:3000/";

  const mailOptions = {
    from: process.env.EMAIL_ID,
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

    }
  })

})

module.exports = router;