const Users = require('../models/user');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.PRIVATE_KEY;

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
        try {
            const user = await Users.findOne({_id: jwt_payload._id });
            
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));
};