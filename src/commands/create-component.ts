import vscode from "vscode";
import fs from "fs";
import ejs from "ejs";
import { toCamelCase, toHyphenated } from "../utils/string.utils";
import { allReactHOCTypes } from "../constants";
import { getComponentTemplate, getFrequentlyUsedPath, getStyleTemplate } from "../utils/path.utils";
import { showMaterialNameInput } from "../utils/interaction.utils";

export const commandOfCreateComponent = vscode.commands.registerCommand("createComponent", async (uri) => {
  try {
    // 选中的文件路径
    const filePath = uri.path;
    const allComponentTypes = fs.readdirSync(getFrequentlyUsedPath().componentTemplatesPath);
    const reactHOCType = await vscode.window.showQuickPick(allReactHOCTypes, { canPickMany: false });
    const componentType = await vscode.window.showQuickPick(allComponentTypes, { canPickMany: false });
    const componentName = await showMaterialNameInput("组件");
    if (componentName && componentType && reactHOCType) {
      const componentDir = filePath + "/" + toHyphenated(componentName);
      fs.mkdirSync(componentDir);
      const componentTemplate = getComponentTemplate(reactHOCType, componentType);
      const styleTemplate = getStyleTemplate();
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