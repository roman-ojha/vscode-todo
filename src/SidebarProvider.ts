import * as vscode from "vscode";
import { authenticate } from "./authenitcate";
import { apiBaseUrl } from "./constants";
import { getNonce } from "./getNonce";
import { TokenManager } from "./TokenManager";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "logout": {
          TokenManager.setToken("");
          break;
        }
        case "authenticate": {
          authenticate(() => {
            // in authenticate we will call a 'get-token' after authenticate is complete
            // now we will go to authenticate and add a callback function
            webviewView.webview.postMessage({
              type: "token",
              value: TokenManager.getToken(),
            });
          });
          break;
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          // here webview is telling extention to do something
          vscode.window.showInformationMessage(data.value);
          //   here this will show the information message if one comes from wabview
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          //   here this will show the Error message if one comes from wabview
          break;
        }
        case "get-token": {
          webviewView.webview.postMessage({
            type: "token",
            value: TokenManager.getToken(),
          });
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
      //   here we are again loading css
      //   these are the default css we are gana add to webview that we create
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
      //   here we are again loading css
      //   these are the default css we are gana add to webview that we create
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
      //   and here we are loading javascript
      //   these are spacific to the webview
      // now we will going to add 'sidebar.js' so we will going to create 'sidebar.ts' in 'webviews/pages/sidebar.ts'
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
      //   these are spacific to the webview
      // now we will going to add 'sidebar.css'
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
          webview.cspSource
        }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}""> 
        const tsvscode = acquireVsCodeApi();
        const apiBaseUrl=${JSON.stringify(apiBaseUrl)}
        <!-- const accessToken=${JSON.stringify(TokenManager.getToken())} -->
        <!--now we can access this tsvscode object inside our svelte-->
        </script>
			</head>
      <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}
