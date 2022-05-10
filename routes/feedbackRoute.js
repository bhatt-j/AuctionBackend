const router = require('express').Router();
let Feedback = require('../models/feedback');

router.route('/add_feedback').post((req, res) => {
    const feedback = new Feedback(req.body)
    feedback.save()
    .then((result) => {
        res.json('Feedback added')
    })
})

module.exports = router;