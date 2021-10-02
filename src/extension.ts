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

/*
        -> After finishing the production of extention and if you want to deploy this extention there is the good documentation for that so you can watch it:
                        -> https://code.visualstudio.com/api/working-with-extensions/publishing-extension

*/

import * as vscode from "vscode";
import { authenticate } from "./authenitcate";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SidebarProvider";
import { TokenManager } from "./TokenManager";
export function activate(context: vscode.ExtensionContext) {
  TokenManager.globalState = context.globalState;

  // this is the activate function and this basically it's called when your extension first get's setup
  let disposable = vscode.commands.registerCommand("vstodo.helloWorld", () => {
    //   here we are resisteringCommand and "vstodo.helloWorld" where we have to start with name of our extention which is "vstodo"
    // vscode.window.showInformationMessage("Hello from VSTodo!");
    vscode.window.showInformationMessage(
      "token value is:" + TokenManager.getToken()
    );

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
  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.refresh", async () => {
      // HelloWorldPanel.kill();
      // HelloWorldPanel.createOrShow(context.extensionUri);
      // here while command 'refresh' we will kill our panel and recreate it
      // so now we again have to debugg because we had change the command
      // now we can just use 'refresh' command to refresh the page or to get the window
      // and we also want to use shortcut to 'open webview developer tool' so to make that
      // we can press f1 and type 'open webview developer tool' and go to setting and right click the command and copy the command ID
      // now we can say vscode to executed the command as well like:
      // so when ever you want to interact with vscode use 'vscode' that we import at the upper side
      // so here it will not instently execute this code so we have to put some setTimeout function
      // setTimeout(() => {
      //   vscode.commands.executeCommand(
      //     "workbench.action.webview.openDeveloperTools"
      //     // and here we just past that command
      //   );
      // }, 500);
      // now if we want to use command to close side bar then copy the command id then:
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      // if you want to open the 'VSTodo' extention then just copy the command id and the past in here
      await vscode.commands.executeCommand(
        "workbench.view.extension.vstodo-sidebar-view"
      );
    })
  );

  /*
    => For sideBar view:
      // these thing are okay when you want all the screen to show you stuff but if you just want to use you sidebar to display stuff then you can do that as well
      // so we are trying to create a sidebar view so we have to tell vscode that we are adding it
      // so in package.json we have to add 'viesContainer' and a 'views':
          -> "contributes": {
                "viewsContainers": {
                  "activitybar": [
                    {
                      "id": "vstodo-sidebar-view",
                      "title": "VSTodo",
                     "icon": "media/checklist.svg"
                    }
                  ]
                },
                "views": {
                  "vstodo-sidebar-view": [
                    {
                      "type": "webview",
                      "id": "vstodo-sidebar",
                      "name": "VSTodo",
                      "icon": "media/checklist.svg",
                      "contextualTitle": "VSTodo"
                    }
                  ]
                },
              },
            => here we have to add our custom 'name', 'title', 'icon','id' etc...
      => and now we need to add an activationEvent in package.json:
              =>   "activationEvents": [
                      "onView:vstodo-sidebar"
                    ],
              NOTE: note that the namehave to match like 'vatodo-sidebar'
      => so for the icon if you want to use icon look like vscode icon then you might have to go to:
        => https://microsoft.github.io/vscode-codicons/dist/codicon.html
        -> once you have find the icon that you want you have to go to github:
                -> https://github.com/microsoft/vscode-codicons
        -> and go to src/icons/<icon_Name> and click on it and just grab the svg like:
                -> <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 4.48h-.71L2 3.43l.71-.7.69.68L4.81 2l.71.71-1.77 1.77zM6.99 3h8v1h-8V3zm0 3h8v1h-8V6zm8 3h-8v1h8V9zm-8 3h8v1h-8v-1zM3.04 7.48h.71l1.77-1.77-.71-.7L3.4 6.42l-.69-.69-.71.71 1.04 1.04zm.71 3.01h-.71L2 9.45l.71-.71.69.69 1.41-1.42.71.71-1.77 1.77zm-.71 3.01h.71l1.77-1.77-.71-.71-1.41 1.42-.69-.69-.71.7 1.04 1.05z"/></svg>
        -> and create .svg file in media folder and then past the code
        => now we will going to initialize that view
*/
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  // here for the 'SidebarProvider' we will going to copy the code form:
  // ->https://github.com/benawad/vsinder/blob/master/packages/extension/src/SidebarProvider.ts
  //
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("vstodo-sidebar", sidebarProvider)
    // here "vstodo-sidebar" string should match from the package.json id
  );

  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  // here we are creating button which is buttom at the vscode editor at the rignt side so, that by just clicking this command will get executed
  item.text = "$(beaker) Add todo";
  // and now here we can add the text on it and also icon where inside $(file-code) is the icon which is from the codicons where we can go to the codicons page and pick a name for the icon
  item.command = "vstodo.addTodo";
  // here we are adding which command to execute
  item.show();

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.addTodo", () => {
      const { activeTextEditor } = vscode.window;
      // activeTextEditor might be undefine as well so we have to make a condition
      // here activeTextEditor will return the text which are active at the moment inside our vscode
      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No active text editor");
        return;
      }
      // const text = activeTextEditor.document.getText();
      // here if we will just going to use '.getText()' then it will going to get all the text inside the textEditor or form the active file but we just want the text which is selected so
      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );
      // now here we can get the text that now we can send it to webview like this
      sidebarProvider._view?.webview.postMessage({
        type: "new-todo",
        value: text,
      });
      // now the thing left is on svelte side in our web view we need to listen for the message that this is going to send
      // now we will add some code inside the 'Sidebar.svelte'
      // after completing code if we will just select the text and run the command then it will going to add in a todo list
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.authenticate", () => {
      // we will going to put a authenitcation login inside the 'src/authenticate.ts' and call that in here
      authenticate(() => {});
    })
  );
}

export function deactivate() {}
