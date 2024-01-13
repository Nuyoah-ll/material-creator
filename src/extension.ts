import * as vscode from "vscode";
import fs from "fs";
import ejs from "ejs";
import { toCamelCase } from "./utils/string.utils";
import { commandOfCreateComponent } from "./commands/create-component";
import {commandOfCreatePage} from "./commands/create-page"

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(commandOfCreateComponent,commandOfCreatePage);
}

export function deactivate() { }
