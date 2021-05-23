 const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcrypt')

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        // Login
        // check if email exists
        const user = await User.findOne({ email: email })
        if(!user) {
            console.log("passport.js user not found");
            return done(null, false, { message: 'No user with this email' })
        }

        // if(!user.confirmed)
        // {
        //     console.log("Please confirm your email to login");
        //     return done(null, false, { message: 'Please confirm your email to login' })
        // }

        

        bcrypt.compare(password, user.password).then(match => {
            if(match) {
                console.log("login ");
                return done(null, user, { message: 'Logged in succesfully' })
            }
            console.log("wrong user name and password");

            return done(null, false, { message: 'Wrong username or password' })
        }).catch(err => {
            console.log("error occured");

            return done(null, false, { message: 'Something went wrong' })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)                
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

}

module.exports = init