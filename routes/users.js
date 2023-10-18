var express = require('express');
var router = express.Router();
const {body,validationResult} = require('express-validator');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Message = require('../models/message');

/* GET users listing. */
router.get('/sign-up', function(req, res, next) {
  res.render('sign-up');
});

router.get('/:id', asyncHandler(async (req, res, next) => {
  const { user, allMessages } = await Promise.all([
    User.findById(req.params.id),
    Message.find({user: req.params.id}).sort({date: -1})
  ]);

  if(!user) {
    const err = new Error('User not found');
    err.status = 404;
    return next(err);
  }
  res.render('user_detail', {user, allMessages});
}));
  


module.exports = router;
