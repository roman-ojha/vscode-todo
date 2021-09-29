/*
-> Project based of:
    1) Frontend Fremework (svelte)
    2) GitHub oauth
    4) API
    5) Node js
    6) Database

=> Getting Start:
    -> https://code.visualstudio.com/api/get-started/your-first-extension
    -> npm install -g yo generator-code
    -> to install globally
    -> now run
        -> yo code
        -> to create a project
    -> now chose a choice what kind of extention for this project we choce:
        -> New Extention (TypeScript)
    ->  ? What type of extension do you want to create? New Extension (TypeScript)
        ? What's the name of your extension? () VSTodo
        ? What's the name of your extension? VSTodo
        ? What's the identifier of your extension? vstodo
        ? What's the description of your extension? Keeping Track of stuff
        ? Initialize a git repository? Yes
        ? Bundle the source code with webpack? Yes
        ? Which package manager to use? (Use arrow keys)
        > npm
        yarn

-> for this project we will delete a 'src/test' folder
-> we will going to use textension.ts

-> while running for the firlst time error:
    -> The talk 'npm:watch' cannot be tracked. Make sure to have a problem matcher defined.
    -> configure task
    -> npm::compile
    -> now it task it will add some script

=> Run the extention:
    -> in task.json those are the task that it run to run the extention
    -> but rignt now we don't want any task so we will going to remove all the default task
    -> and we will going to run it our self
    -> on package.json in script we can see :
        -> 	"scripts": {
            "watch": "webpack --watch",
            },
        -> where watch run webpack
    -> now to run the extention type:
        -> yarn watch
		-> npm run watch
    -> which will just going to compile the extention.ts file into the 'dist' folder in 'extention.js'
    -> where webpack transpiles all your code
    -> where it take the .ts file and convert it into javascript file
    -> we will going to remove :	"preLaunchTask": "${defaultBuildTask}" from launch.json file 
    -> for some launch config
    -> now executed the code press f5

=> 
    -> now it will open the another window
    -> where press f1 and type 'hello world' and enter it, it will pop up the message saying "Hello World from VSTodo!"
    -> because we have the script inside the extension like that:
            -> let disposable = vscode.commands.registerCommand("vstodo.helloWorld", () => {
                            vscode.window.showInformationMessage("Hello World from VSTodo!");
                        });
            -> here "helloWorld" is the registering Commange and message is "Hello World from VSTodo!"
	
	-> every time we change something in code we have to relunch the extention

*/

/*
        => For this project we will going to include 'vscode webview' so go and search 'vscode webview' in browser
            -> https://code.visualstudio.com/api/extension-guides/webview
            -> repository:
                -> https://github.com/microsoft/vscode-extension-samples/tree/main/webview-sample
                -> https://github.com/microsoft/vscode-extension-samples
                -> in here there is a lot of example of vacode extention that you can look at if get stock
            -> we are uisng :
                        -> https://github.com/benawad/vsinder
                        -> repository to grab sum code 
                        -> here we grab code form :
                            -> https://github.com/benawad/vsinder/blob/master/packages/extension/src/SwiperPanel.ts
                        -> and past in "HellowWorldPanel.ts"
*/
import * as vscode from "vscode";
import { HelloWorldPanel } from "./HellowWorldPanel";
export function activate(context: vscode.ExtensionContext) {
  // this is the activate function and this basically it's called when your extension first get's setup
  console.log('Congratulations, your extension "vstodo" is now active!');
  let disposable = vscode.commands.registerCommand("vstodo.helloWorld", () => {
    //   here we are resisteringCommand and "vstodo.helloWorld" where we have to start with name of our extention which is "vstodo"
    // vscode.window.showInformationMessage("Hello from VSTodo!");

    // here we will going to activate this pannel just when we call hello world
    HelloWorldPanel.createOrShow(context.extensionUri);
    // this function takes 'extensionUri'
    // and 'extensionUri' comes with context -> function activate(context: vscode.ExtensionContext) {}
    // now we can run the 'hell world' command and we will see that we create the new window
  });
  context.subscriptions.push(disposable);
  //	where context.subscriptions.push(disposable) thing where it return the value to 'disposable'
  //   and the purpose of this is for vscod to be able to dispose of this listeneer whenever it's done
  //   it means we can wrap the whole function inside the 'push()' Like

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.askQuestion", async () => {
      // here we are again making another cammand which is "askQuestion" and it function wll run whenever this command will caugnt
      const answer = await vscode.window.showInformationMessage(
        "How was your day?",
        "good",
        "bad"
      );
      // where informationShow like:
      // -> it will ask a question "How was your day?" and we can chose 'good' or 'bad'
      // and to get the response we will make function 'async' and get the answer
      if (answer === "bad") {
        vscode.window.showInformationMessage("Sorry to here that");
        // here we are showing the information message after respose of request
      } else {
        console.log({ answer });
      }
    })
    // now this is not the only thing when you add you command
    // we have to add it to package.json
    // where we have to tell vs code all the thing that you add in you extention
    /*
		=> "contributes": {
				"commands": [
				{
					"command": "vstodo.helloWorld",
					"category":"VSTodo",
					// here now "VSTodo" is the category of the command which we can do as well
					"title": "Ask Question"
					// here this title will show up when the user run the command
				}
				]
			}
		-> now this is the metadata now we have to tell to the vscode to activate it by adding to package.json:
			-> "activationEvents": [
					"onCommand:vstodo.askQuestion"
				],
	*/
  );
}

export function deactivate() {}
