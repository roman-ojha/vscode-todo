// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
  const vscode = acquireVsCodeApi();
  // this vscode allowed us to do some vscode thing and allow us to communicate with the vs code extention

  //   const button = document.getElementById("button");
  //   button.innerText = "Hello from javascript";
  console.log("Hello Javascript");
  //   Here you can write the eitire webview using venilla javascript which is not good to do because which is much harder to write a code
  //   so for that reason we will going to use javascirpt framework to write a javascript code and we will include or import that file into 'HellowWorldPanel.ts' like:
  /*
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );
  */
  //  for that purpose we will going to use 'svelte' framework for this project
  // for that we will going to grab a code "rollup.config.js" from:
  // -> https://github.com/benawad/vsinder/blob/master/packages/extension/rollup.config.js
  // rollup is kind like a webpack that will going to trun on svelte code into javascript code
  // so, we will going to create new file in root directory called "rollup.config.js"
  // now comment transfer to "rollup.config.js"
})();
