import * as vscode from "vscode";
const KEY = "vstodotoken";
export class TokenManager {
  static globalState: vscode.Memento; // 'vscode.Memento' is the type
  static setToken(token: string) {
    return this.globalState.update(KEY, token);
    // here we are storing the token using globalstate in 'vstodotoken'
    // the token will going to store after we close vscode as well
    // update is a promise
  }
  static getToken(): string | undefined {
    return this.globalState.get(KEY);
    // now here we can get the token value
    // get is asyncronous
  }
}
