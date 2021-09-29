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
    
*/

import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/user";
import dotenv from "dotenv";

(async () => {
  dotenv.config({ path: "config.env" });
  // here we are connecting to a database
  await createConnection({
    type: "postgres",
    database: process.env.DATABASE,
    username: "postgres",
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
  app.get("/", (_req, res) => {
    res.send("Hello");
  });
  app.listen(8080, () => {
    console.log("listening on 8080");
  });
})();
