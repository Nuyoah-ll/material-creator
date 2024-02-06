import vscode from "vscode";
import fs from "fs";
import ejs from "ejs";
import { toCamelCase, toHyphenated } from "../utils/string.utils";
import { allReactHOCTypes } from "../constants";
import { getComponentTemplate, getFrequentlyUsedPath, getStyleTemplate } from "../utils/path.utils";

export const commandOfCreateComponent = vscode.commands.registerCommand("createComponent", async (uri) => {
  try {
    // 选中的文件路径
    const filePath = uri.path;
    const allComponentTypes = fs.readdirSync(getFrequentlyUsedPath().componentTemplates);
    const reactHOCType = await vscode.window.showQuickPick(allReactHOCTypes, { canPickMany: false });
    const componentType = await vscode.window.showQuickPick(allComponentTypes, { canPickMany: false });
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
    if (componentName && componentType && reactHOCType) {
      const componentDir = filePath + "/" + toHyphenated(componentName);
      fs.mkdirSync(componentDir);
      const componentTemplate = await getComponentTemplate(reactHOCType, componentType);
      const styleTemplate = await getStyleTemplate();
      // TODO 暂时先不支持自定义模板，后续考虑增加
      // const cpnTempFile = await vscode.workspace.findFiles(`.byte-materials-creator/${componentType}.ejs`);
      // const styleTempFile = await vscode.workspace.findFiles(".byte-materials-creator/style.ejs");
      // const cpnTemp = cpnTempFile[0].path;
      // const styleTemp = styleTempFile[0].path;
      const renderData = { upperCamelCaseComponentName: toCamelCase(componentName, "upper"), lowerCamelCaseComponentName: toCamelCase(componentName, "lower") };
      ejs.renderFile(componentTemplate, renderData, {}, function (err, str) {
        fs.writeFileSync(componentDir + "/index.tsx", str);
      });
      ejs.renderFile(styleTemplate, renderData, {}, function (err, str) {
        fs.writeFileSync(componentDir + "/index.module.scss", str);
      });
    }
  } catch (e) {
    console.log(e);
  }
});