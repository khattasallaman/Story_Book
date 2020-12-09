const express = require('express');
const router = express.Router();
const {ensureGuest, ensureAuth} = require('../middleware/auth')
const Story = require('../modals/Story')

router.get('/',ensureGuest, (req, res)=> {
    res.render("login", {
        layout:'login'
    })
})


//DASHBOARD
router.get('/dashboard', ensureAuth, async (req, res)=> {
    try {
        let stories = await Story.find({user: req.user.id}).lean()
        res.render("dashboard", {
            name: req.user.firstName,
            stories,
            Authuser: req.user
        })  
    } catch (error) {
        res.render('errors/505', {
            err:error
        })
    }
    
})


module.exports = router