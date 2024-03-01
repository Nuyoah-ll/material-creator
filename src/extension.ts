import * as vscode from "vscode";
import { commandOfCreateComponent } from "./commands/create-component";
import { commandOfCreatePage } from "./commands/create-page";
import { FileCheckDecorationProvider } from "./features/file-check";
import { commandOfRemoveEmptyDir } from "./commands/remove-empty-dir";
import { routeCheck } from "./features/route-check";

export let globalState: vscode.ExtensionContext['globalState'];

export function activate(context: vscode.ExtensionContext) {
  globalState = context.globalState;
  routeCheck();
  context.subscriptions.push(commandOfCreateComponent, commandOfCreatePage, commandOfRemoveEmptyDir, new FileCheckDecorationProvider());
}

export function deactivate() { }
