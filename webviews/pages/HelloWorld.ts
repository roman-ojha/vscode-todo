import App from "../components/HelloWorld.svelte";
// here we import svelte component inside our pages

/*
    -> now we will going to install concurrently :
        -> which just allow us to run command at once
            ->  npm i -D concurrently 
        -> now we will going to add :
            ->  "scripts": {
                "watch":"concurrently \"rollup -c -w\" \"webpack --watch\""
                    // where this is the watch script so concurrently "rollup -c -w" it is the command that get runs so rollup compile with watch mode and second command that it will going to run is 'webpack --watch'
                    // where rollup will compile all the svelte stuff and and webpack is compiling extention
                },
            -> inside our package.json file 
            -> so it means we have to install rollup
                ->  npm i -D rollup

            -> now in tsconfig.json we have to exclude 'webviews'
                -> "exclude": ["node_modules", ".vscode-test", "webviews"]
                -> basically what it is saying is that the tsconfig on the outer level should ignore all of our svelte typescript code
            
            -> now we can see in 'out' directory where svelte compile code will be
            -> it means in '/src/HellowWorldPanel.ts' we have to include 
                ->  const scriptUri = webview.asWebviewUri(
                        vscode.Uri.joinPath(this._extensionUri, "out", "hellowWorld.js")
                        );
                -> as the javascirpt file to run javascript
            
                -> NOTE: note that firstly you have to complie using:
                    -> npm run watch
                -> no need to debugg it again and again 

            -> now again we will go to the package.json and add:
                     "activationEvents": [
                            "onCommand:vstodo.refresh"
                        ],
                    "contributes": {
                    "commands": [
                        {
                            "command": "vstodo.refresh",
                            "category": "VSTodo",
                            "title": "Refresh"
                        }
                        ]
                -> it means we have to add this command into extension so:
                -> now comment pass to the extension.ts
},
*/

const app = new App({
  target: document.body,
  // so here it is targeting the document body so this is where svelte start doing things
});

export default app;
