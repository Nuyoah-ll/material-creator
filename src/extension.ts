// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import fs from "fs";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // 注册命令
  let commandOfGetFileState = vscode.commands.registerCommand(
    "createComponent",
    (uri) => {
      // 文件路径
      const filePath = uri.path.substring(1);
      vscode.window
        .showInputBox({
          // 这个对象中所有参数都是可选参数
          password: false, // 输入内容是否是密码
          ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
          placeHolder: "请输入组件名称", // 在输入框内的提示信息
          prompt: "连字符或者是大/小驼峰都可以~", // 在输入框下方的提示信息
          validateInput: function (text) {
            return /^[a-zA-Z0-9-]+$/.test(text) ? undefined : "只能输入大小写英文字母、数字、短横线组合";
          }, // 对输入内容进行验证并返回
        })
        .then(function (msg) {
          console.log("用户输入：" + msg);
        });
      console.log(uri);
      fs.mkdirSync(filePath);
      vscode.window.showInformationMessage(filePath);
    }
  );
  // 将命令放入其上下文对象中，使其生效
  context.subscriptions.push(commandOfGetFileState);
}

// This method is called when your extension is deactivated
export function deactivate() {}
