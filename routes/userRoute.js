const router = require('express').Router();
let User = require('../models/user');
const {upload} = require('../filehelper/filehelper');

// email verification
const mail = require('nodemailer')
const {v4 : uuidv4} = require('uuid')


//bcrypt
const bcrypt = require('bcryptjs')

//responses
const responses = require("../utils/responses")

//validations
const validation = require('../validations/register.validation');
const { json } = require('express');

let transporter = mail.createTransport({
  service: "gmail",
  auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS
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

const sendVerificationMail = ({_id, email, uniqueToken}, res) => {
  
  const currentUrl = "http://localhost:4000/";
  

  const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your Email",
      html: `<p> Click <a href=${currentUrl + "user/verify" + "/" + uniqueToken}>here</a> to verify your mail </p>`
  }

  transporter.sendMail(mailOptions)
  .then(() => {
      res.json("Mail Sent!")
  })
  .catch((err) => {
      res.json(err);
  });
}


router.route('/all').get((req, res) => {
  User.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => { console.log(err) })
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

    let user = await User.findOne({
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

router.route('/login').post(async (req, res) => {
  console.log('hello');
  User.findOne({ email: req.body.email })
    .then(user => {
      console.log(user);
      if (!user)
        return res.status(404).json({ error: "No user found" })
      else {
        bcrypt.compare(req.body.password, user.password, (error, result) => {
          if (error)
            return res.status(500).json(error)
          else if (result)
            return res.status(200).json(user)
          else
            return res.status(403).json({ error: "Password is incorrect" })
        })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
});

router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error' + err));
});

router.route('/updateUser/:id').put(async function (req, res) {
  if(req.body.password){
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash_password;
  }
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error' + err));
});

router.route('/uploadFile/:id').put(upload.single('avtar'),async (req,res)=>{

  try{
      const file = {
          avtar: req.file.path,
      }
      User.findByIdAndUpdate(req.params.id,{"avtar":req.file.path})
      .then(user=>res.json(user))
      console.log(file);
      res.status(201).send('File uploaded');
  }
  catch(error){
      res.status(400).send(error.message);
  }
});

router.route('/deleteUser/:id').delete((req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error' + err));
});

module.exports = router;