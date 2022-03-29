const express = require('express');
const {upload} = require('../filehelper/filehelper')
const router = express.Router();
const User = require('../models/user');

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

module.exports=router;