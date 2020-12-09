const express = require('express');
const User = require('../modals/User')
// const bodyParser = require('body-parser')
const passport = require('passport')

const router = express.Router();

// router.use(bodyParser.json());

//LOGIN

router.get('/google', passport.authenticate('google', {scope: ['profile']}))


router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/dashboard'}), (req, res, next)=> {
    // console.log("this is the user afterrrrr sucesssssss   ",req.user)
    res.redirect('/dashboard')
})


//LOGOUT

router.get('/logout', (req, res)=> {
    req.session.destroy();
    req.logOut();
    res.clearCookie('session-id')
    res.redirect('/')
})

module.exports = router