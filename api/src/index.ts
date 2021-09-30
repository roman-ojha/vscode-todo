/*
   -> NOTE: I put the api inside the vscode extention root folder so it will throw an error so we have to exclude 'api' folder in 'tsconfig.json'
    -> firstly we will going to install
        -> npm i express
    -> we know we are using typescript so we have to install:
        -> npm i -D typescript @types/node @types/express nodemon
    -> we also need tsconfig.json so first we will install typescript globally and then we will get the tsconfig.json
        -> npm install -g typescript
        -> tsc --init
    -> but don't know is that will going to work so i will going to copy code from:
      -> https://github.com/benawad/vstodo/blob/master/api/tsconfig.json
      -> for right now 

    -> now we have to configure something in scripts in package.json
        -> "scripts": {
                "watch": "tsc -w",
                "dev": "nodemon dist/index.js"
            },
    -> after this we will go to root api folder and run :
            -> yarn watch
            -> which will compile the .ts file and make a .js file in 'dist' folder
    -> and in new terminal run:
            -> yarn dev
    
    -> for database we will going use 'PostgreSQL' so get setup and install it:
    -> and we will going to install :
            -> npm i typeorm pg reflect-metadata
    -> and makesure that in tsconfig.json we have this things:
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
    
    -> next we will going to add a logic so that user can login with github and for that we will going to use a library called passport
            -> npm i passport-github passport

*/

import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/user";
import dotenv from "dotenv";
import { Strategy as GitHubStrategy } from "passport-github";
// npm i --save-dev @types/passport-github => to remove error for typescript
import passport from "passport";
import jwt from "jsonwebtoken";

(async () => {
  dotenv.config({ path: "config.env" });
  // here we are connecting to a database
  await createConnection({
    type: "postgres",
    database: process.env.DATABASE,
    username: "postgres",
    dropSchema: true,
    password: process.env.PASSWORD,
    entities: [join(__dirname, "./entities/*.*")],
    // here for entities we will going to make a new folder called 'entities' inside we will create 'user.ts' file
    // __dirname will let us in the absolute path or where we run 'index.ts'
    // here '*.*' will gives us all javascript and typescript files
    // you can do '*.js" just to get all js file as well

    logging: !__prod__,
    synchronize: !__prod__,
  });
  const user = await User.create({ name: "bob" }).save();
  // here we created the user
  console.log({ user });
  const app = express();
  // Github authentication----------------------------------
  // so firstly register a application in github by:
  // https://github.com/settings/developers
  // go and register to OAuth Apps
  passport.use(
    new GitHubStrategy(
      {
        // by making .env file you can make another .env.example and put the variable that you have use in this project so that when other use use this project they can know the variable that we use
        // and note that when you will try to use the environment variable in project file yolu will not going to get the suggesstion so to solve that problem see this git repo https://github.com/benawad/gen-env-types
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        // in typescript we can't use 'GITHUB_CLIENT_ID' directly because typescript doesn't know that it is a string so for that we have to tell typescript that it is a string by creating types folder and create 'environment.d.ts' file inside that where we have to put all the variable and there type like:
        /*
                declare namespace NodeJS {
                  interface ProcessEnv {
                    GITHUB_CLIENT_ID: string;
                    GITHUB_CLIENT_SECRET: string;
                  }
                }
        */
        callbackURL: "http://localhost:8080/auth/github/callback",
      },
      async (_, __, profile, cb) => {
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (user) {
          // if user logged in before
          user.name = profile.displayName;
          await user.save();
        } else {
          // if user never logged in before
          user = await User.create({
            name: profile.displayName,
            githubId: profile.id,
          }).save();
        }
        //here we are going to call the callback
        cb(null, {
          accessToken: jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "1y",
            }
          ),
        });
        // here we will going to pass accessToken
        // and we will going to generage it form jsonwebtoken package:
        // -> npm i jsonwebtoken
        // and we also have to install:
        // npm i -D @types/jsonwebtoken => because this need a type in typescript
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });
      }
    )
  );
  passport.serializeUser(function (user: any, done) {
    // serialize means we pass an object for an user and we need to turn to a string here we are turning stiring of "user.accessToken"
    done(null, user.accessToken);
  });
  app.use(passport.initialize());

  app.get("/auth/github", passport.authenticate("github", { session: false }));
  // here if user go to this url we are authenticating the user by login
  app.get(
    "/auth/github/callback",
    // this is the call back when authenitcation complited
    passport.authenticate("github", { session: false }),
    (req: any, res) => {
      // here 'req.user' is accesstoken
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
      // normally when we will work with a website we will redirect to that website but we are authenticating with an extention so extention have to start a server that we can send it to and here we are going to start a server on 54321 where this url will going to be same on the production as well
    }
  );
  app.get("/", (_req, res) => {
    res.send("Hello");
  });
  app.listen(8080, () => {
    console.log("listening on 8080");
  });
})();
