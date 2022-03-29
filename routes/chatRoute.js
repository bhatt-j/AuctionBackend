const router = require('express').Router();
let Chat = require('../models/chat.models');

router.route('/:id').get((req,res)=> {
    Chat.findById(req.params.id)
    .then(chat=>res.json(chat))
    .catch(err=>res.status(400).json('Error' + err));
});

router.route('/add_chat').post((req, res) => {
    const chat = new Chat(req.body)
    chat.save()
    .then((result) => {
        res.json('Chat added')
    })
});

router.route('/:id').get((req,res)=> {
    Chat.findById(req.params.id)
   .then(chat=>res.json(chat))
   .catch(err=>res.status(400).json('Error' + err));
});

router.route('/updateChat/:id').put(function(req,res){
    Chat.findByIdAndUpdate(req.params.id,req.body)
    .then(chat=>res.json(chat))
    .catch(err=>res.status(400).json('Error' + err));
})

router.route('/deleteChat/:id').delete((req,res)=> {
    Chat.findByIdAndRemove(req.params.id)
   .then(chat=>res.json(chat))
   .catch(err=>res.status(400).json('Error' + err));
});

module.exports = router;