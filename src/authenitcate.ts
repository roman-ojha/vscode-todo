import { apiBaseUrl } from "./constants";
import * as vscode from "vscode";
import * as polka from "polka";
import { TokenManager } from "./TokenManager";

export const authenticate = () => {
  // here we are creating polka server and the expalnation is down bellow
  const app = polka();
  app.get("/auth/:token", async (req, res) => {
    // here we are redirecting to the '/auth/<token>'so we have to route that url
    // here ':token' will take the value and store the value in variable 'token'
    const { token } = req.params;
    // req.params will gives the object of parameters
    if (!token) {
      res.end("<h1>something went wrong</h1>");
      return;
    }
    // so in vscode the way that we store token is the global state and you have to access the global state by context variable
    // so no we have to create a 'globalState' in extention.ts :
    // TokenManager.globalState = context.globalState;
    // so for that we can create a class(file) called 'TokenManager.ts'
    // this class will going to have a global refrence to 'globalState'
    await TokenManager.setToken(token);
    // now we can store the token using setToken function
    res.end("<h1>auth was successful, you can close this now</h1>");
    // after authentication complete we can close the url means we can close the server because we don't need that now
    (app as any).server.close();
    // (app as any) for the typescript
    // now we will back to the api side
  });
  app.listen(54321, (err: Error) => {
    //   we know that the url port redrdirect form the github authentication is 54321
    if (err) {
      // if there is an error show and error
      vscode.window.showErrorMessage(err.message);
    } else {
    }
  });

  // firstly on authenticate is actually to send us to our api and take us to that url that we are clicking like to lunch:
  // localhost:8080/auth/github
  // for that firstly we have to import vscode
  vscode.commands.executeCommand(
    "vscode.open",
    vscode.Uri.parse(`${apiBaseUrl}/auth/github`)
  );
  //   so this is the syntax that tell vscode to open a url where we are using 'vscode.open' command we have to parse it this is how vscode handle url
  // and inside the parse("") we can pass the url but we will going to create a constant file and export the variable 'apiBaseUrl from there which will help us when it goes for the production
  //   after that we need to listen to the redirect url that we have redirected form server and read token from there
  //   in these kind of situation we can use 'session' but for this it is not easy to use cookies
  // so to listen to that url we have to create a server and listen form the request
  //   for that we can use express but in this case we are using webpack to compile or bundle everything
  // so we will going to use library call 'polka' => npm i polka
  //   and also we have to install a types here => npm i --save-dev @types/polka
  //   'polka' is same as the express but of light wight
  //   if it says error to import then include this in tsconfig.json => "allowSyntheticDefaultImports": true,
};
