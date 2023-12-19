import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserModel from "../model/User.js";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "simbanic";
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await UserModel.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }

    // UserModel.findOne({ id: jwt_payload.sub }, function (err, user) {
    //   if (err) {

    //   }
    //   if (user) {
    //     return done(null, user);
    //   } else {
    //     return done(null, false);
    //   }
    // });
  })
);

// passport.js

passport.serializeUser((user, done) => {
  done(null, user.id); // Use the unique identifier here
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

