/*
 //-> where most of that code is copy pasting exactly from svelte's getting started boilerplate
    with one exception which is:
        -> export default fs.readdirSync(path.join(__dirname, "webviews", "pages"))
        -> here we are reading a directory which is 'webviews' in inside of that 'pages'
        -> it means we have to create a new folder called webview inside root folder
        -> so in our extention we could have multiple extention so,we need a multiple pages
        -> so as we add pages it will automatically compile each one it means we don't have to come and touch things

        -> now we will also going to have tsconfig.json
        -> where copy code from:
            -> https://github.com/benawad/vsinder/blob/master/packages/extension/svelte-stuff/tsconfig.json
        -> so we will going to have to tsconfig.json one at the root level which is for our extention
        -> we will going to have different 'tsconfig.js' inside our webview
        -> the reason for that is it need a different type scrypt

        // now we have to install all these packages as dev dependency
        //  npm i -D rollup-plugin-svelte @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup-plugin-terser svelte-preprocess @rollup/plugin-typescript

        // and also we have to install :
        // i -D @tsconfig/svelte svelte svelte-check svelte-preprocess

        -> and we will going to create a new folder inside the webviews called 'components' where all the svelte stuff will going to be
        -> and we will going to create a 'HelloWorld.svelte' inside there
        -> Now comment goes to 'HelloWorld.svelte'
*/

import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import path from "path";
import fs from "fs";

const production = !process.env.ROLLUP_WATCH;

export default fs
  .readdirSync(path.join(__dirname, "webviews", "pages"))
  .map((input) => {
    const name = input.split(".")[0];
    return {
      input: "webviews/pages/" + input,
      output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "out/compiled/" + name + ".js",
        // it will going to create a out file
      },
      plugins: [
        svelte({
          // enable run-time checks when not in production
          dev: !production,
          // we'll extract any component CSS out into
          // a separate file - better for performance
          css: (css) => {
            css.write(name + ".css");
          },
          preprocess: sveltePreprocess(),
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
          browser: true,
          dedupe: ["svelte"],
        }),
        commonjs(),
        typescript({
          tsconfig: "webviews/tsconfig.json",
          sourceMap: !production,
          inlineSources: !production,
        }),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        // !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        // !production && livereload("public"),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
      ],
      watch: {
        clearScreen: false,
      },
    };
  });
