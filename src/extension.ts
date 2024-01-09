import * as vscode from "vscode";
import fs from "fs";
import ejs from "ejs";
import { toCamelCase } from "./utils/string.utils";

export function activate(context: vscode.ExtensionContext) {
  // 注册命令
  let commandOfGetFileState = vscode.commands.registerCommand("createComponent", async (uri) => {
    // 文件路径
    const filePath = uri.path;
    const componentName = await vscode.window.showInputBox({
      // 这个对象中所有参数都是可选参数
      password: false, // 输入内容是否是密码
      ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
      placeHolder: "请输入组件名称", // 在输入框内的提示信息
      prompt: "仅支持连字符或者是大/小驼峰", // 在输入框下方的提示信息
      validateInput: function (text) {
        return /^[a-zA-Z0-9-]+$/.test(text) ? undefined : "只能输入大小写英文字母、数字、短横线组合";
      }, // 对输入内容进行验证并返回
    });
    if (componentName) {
      const componentDir = filePath + "/" + componentName;
      fs.mkdirSync(componentDir);
      const cpnTempFile = await vscode.workspace.findFiles(".byte-materials-creator/component.ejs");
      const styleTempFile = await vscode.workspace.findFiles(".byte-materials-creator/style.ejs");
      const cpnTemp = cpnTempFile[0].path;
      const styleTemp = styleTempFile[0].path;
      const renderData = { upperCamelCaseComponentName: toCamelCase(componentName, "upper"), lowerCamelCaseComponentName: toCamelCase(componentName, "lower") };
      ejs.renderFile(cpnTemp, renderData, {}, function (err, str) {
        fs.writeFileSync(componentDir + "/index.tsx", str);
      });
      ejs.renderFile(styleTemp, renderData, {}, function (err, str) {
        fs.writeFileSync(componentDir + "/index.module.scss", str);
      });
    }
  });
  // 将命令放入其上下文对象中，使其生效
  context.subscriptions.push(commandOfGetFileState);
}

// This method is called when your extension is deactivated
export function deactivate() { }
