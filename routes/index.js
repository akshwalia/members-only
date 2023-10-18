var express = require('express');
var router = express.Router();
const {body,validationResult} = require('express-validator');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user');
const Message = require('../models/message');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const messages = await Message.find().populate('author').sort({date: -1}).exec();
  res.render('index', { title: 'Members ONLY', user: req.user, messages: messages });
});

router.get('/sign-up', function(req, res, next) {
  res.render('sign-up');
});

router.post('/sign-up',[
  body('first_name').trim().escape().isLength({min: 1}).withMessage('First name must be specified.'),
  body('last_name').trim().escape().isLength({min: 1}).withMessage('Last name must be specified.'),
  body('username').trim().escape().isLength({min: 1}).withMessage('Username must be specified.'),
  body('password').trim().escape().isLength({min: 8}).withMessage('Password must be 8 characters long.'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword,
        is_member: false,
      });
    if (!errors.isEmpty()) {
      res.render('sign-up', { errors: errors.array(), user});
    } 
    else {
      await user.save();
      res.redirect('/');
    }
  })
]);
  
router.get('/log-in', function(req, res, next) {
  res.render('log-in');
});

router.post('/log-in', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in',
})
);

router.get('/log-out', function(req, res, next) {
  req.logout((err) => console.log(err));
  res.redirect('/');
});

router.get('/create-message', function(req,res,next) {
  res.render('create-message', {user: req.user});
});

router.post('/create-message', [
  body('title').trim().escape().isLength({min: 1}).withMessage('Title must be specified.'),
  body('body').trim().escape().isLength({min: 1}).withMessage('Body must be specified.'),
  asyncHandler(async (req, res, next) => {
    const message = new Message({
      author: req.user._id,
      title: req.body.title,
      body: req.body.body,
      date: new Date(),
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('create-message', { errors: errors.array(), message: message});
    } 
    else {
      await message.save();
      res.redirect('/');
    }
  }
)]);

router.get('/become-member', function(req, res, next) {
  res.render('become-member');
});

router.post('/become-member', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (req.body.answer === 'Shalu' || req.body.answer === 'shalu')
    user.is_member = true;
  else
    user.is_member = false;
  await user.save();
  res.redirect('/');
}));

module.exports = router;

