import * as vscode from "vscode";
import { commandOfCreateComponent } from "./commands/create-component";
import { commandOfCreatePage } from "./commands/create-page";

export let globalState: vscode.ExtensionContext['globalState'];

export function activate(context: vscode.ExtensionContext) {
  globalState = context.globalState;
  context.subscriptions.push(commandOfCreateComponent, commandOfCreatePage);
}

export function deactivate() { }
