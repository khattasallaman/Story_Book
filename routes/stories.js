const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth')
const Story = require('../modals/Story')


router.get('/add', ensureAuth, (req, res)=> {
    res.render('stories/add')
})

router.post('/', ensureAuth, async (req, res)=> {
    try {
        req.body.user  = req.user.id;
        await Story.create(req.body)
        res.redirect('/dashboard')

    } catch (error) {
        res.render('errors/505', {err:error})
    }
})
router.get('/', ensureAuth, async(req, res)=> {
    try {
        let stories = await Story.find({status:"public"}).populate('user').sort({createdAt:'desc'}).lean();
        res.render("stories/index", {
            stories,
            userId: req.user.id.toString(),
        })
    } catch (error) {
        res.render('errors/505', {err:error})
    }
})
router.get('/privates', ensureAuth, async(req, res)=> {
    try {
        let stories = await Story.find({status:"private", user:req.user.id}).populate('user').sort({createdAt:'desc'}).lean();
        res.render("stories/privates", {
            stories
        })
    } catch (error) {
        res.render('errors/505', {err:error})
    }
})

router.get('/edit/:id', ensureAuth, async (req, res)=> {
    try {
        const story = await Story.findOne({_id:req.params.id}).lean()
        if (!story) {
         return   res.render('errors/404')
        }
        else {
            if(story.user != req.user.id){
               return res.render('errors/403')
            }
            else {
                res.render('stories/edit', {
                    story
                })
            }
        }  
    } catch (error) {
        res.render('errors/505', {err:error})

    }
   
})


router.route('/:id')
.get(ensureAuth, async (req, res)=> {
    try {
        const story = await Story.findById(req.params.id).populate('user').lean();
        if(!story){
            return res.render('errors/404')
        }
        else {
            res.render('stories/fullStory', {
                story:story,
                userId: req.user.id.toString(),
                storyUserId: story.user._id.toString()
            });
        }
    } catch (error) {
         res.render("errors/505", {err: error})
    }
})
.put(ensureAuth, async (req, res)=> {
    try {
        const story = await Story.findById(req.params.id)
        if(!story){
           return res.render('errors/404')
        }
        else {
            await Story.findByIdAndUpdate({_id:req.params.id},req.body, {
                new:true,
                runValidators:true
            })
            res.redirect('/dashboard')
        }
    } catch (error) {
        res.render('errors/505')
    }
})
.delete(ensureAuth, async (req, res)=> {
    try {
        // console.log("this is the reqqqq ",req)
        const story = await Story.findById(req.params.id);
        if(! story){
           return res.render('errors/404')
        }
        else {
            if(story.user != req.user.id){
              return  res.render('errors/403')
            }
            else {
               await Story.findByIdAndRemove(req.params.id)
               const origin = req.headers.referer
               console.log("this is the origon", origin)
               const index = origin.toString().indexOf("0")
                const to = origin.substring(index + 4)
                console.log("this is the to", to)
                if(to === "stories") res.redirect('/stories')
                else if(to === "stories/privates") res.redirect('/stories/privates')
                else res.redirect('/dashboard')
            }
        }
    } catch (error) {
        res.render('errors/505', {err:error})
    }
})


router.get('/user/:id', ensureAuth, async(req, res)=> {
    try {
        const stories = await Story.find({user: req.params.id, status:'public'}).populate('user').lean();
        if(!stories){
            return res.render('errors/404')
        }
        else {
            res.render('stories/index', {
                stories,
                froUser:true
            })
        }
    } catch (error) {
        
    }
})

module.exports = router