/*
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
*/

import express from "express";

(async () => {
  const app = express();
  app.get("/", (_req, res) => {
    res.send("Hello");
  });
  app.listen(8080, () => {
    console.log("listening on 8080");
  });
})();
