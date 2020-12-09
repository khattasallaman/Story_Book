const GoogleStrategy = require('passport-google-oauth20').Strategy
const config = require('../config/config')
const User = require('../modals/User')

module.exports = (passport) => {passport.use(new GoogleStrategy({
    clientID: config.google.clientid,
    clientSecret: config.google.clientSecret,
    callbackURL:'https://stories-books-app.herokuapp.com/auth/google/callback'
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        let user = await User.findOne({googleId: profile.id})
        if(user){
            cb(null, user)
        }
        else {
            let newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName:profile.name.givenName,
                lastName:profile.name.familyName,
                image:profile.photos[0].value
            }
            newUser = await User.create(newUser);
            // console.log()
            cb(null, newUser)
            
        }
    } catch (error) {
        console.error(error)
    }
}))
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
        done(err, user);
        });
    });
}