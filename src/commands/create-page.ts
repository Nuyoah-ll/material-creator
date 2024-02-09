import vscode from "vscode";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import { toCamelCase, toHyphenated } from "../utils/string.utils";
import { getComponentTemplate, getFrequentlyUsedPath, getStyleTemplate } from "../utils/path.utils";
import { showMaterialNameInput, showPageFileSelector } from "../utils/interaction.utils";

const MIC_PATH = "./src/microapps";
const DOMAIN_PATH = "./src/domains";
const ROUTE_PATH = ".src/routes.tsx";

export const commandOfCreatePage = vscode.commands.registerCommand("createPage", async (uri) => {
  // 文件路径
  try {
    // 选中的文件路径
    const filePath = uri.path;
    const { pageTemplatesPath } = getFrequentlyUsedPath();
    const commonComponentTemplatePath = getComponentTemplate();
    const commonStyleTemplatePath = getStyleTemplate();
    const allPageTemplates = fs.readdirSync(pageTemplatesPath);
    const pageName = await showMaterialNameInput("页面");
    const quickPickFileTemplatesName = await showPageFileSelector(allPageTemplates);
    const selectedFileTemplatesName = quickPickFileTemplatesName.map(item => item.label);
    if (pageName) {
      const pageDir = filePath + "/" + toHyphenated(pageName);
      fs.mkdirSync(pageDir);
      const renderData = { upperCamelCaseComponentName: toCamelCase(pageName, "upper"), lowerCamelCaseComponentName: toCamelCase(pageName, "lower") };
      selectedFileTemplatesName.forEach(item => {
        const templatePath = path.resolve(pageTemplatesPath, item);
        const templateExt = path.extname(templatePath);
        const templateName = path.basename(templatePath, ".ejs");
        if (templateExt === ".ejs") {
          ejs.renderFile(path.resolve(pageTemplatesPath, templatePath), renderData, {}, function (err, str) {
            fs.writeFileSync(path.resolve(pageDir, templateName + (templateName !== "columns" ? ".ts" : ".tsx")), str);
          });
        } else {
          const commonPath = path.resolve(pageDir, "common");
          const isCommonDirExist = fs.existsSync(commonPath);
          if (!isCommonDirExist) {
            fs.mkdirSync(commonPath);
          }
          fs.mkdirSync(path.resolve(commonPath, templateName));
        }
      });
      ejs.renderFile(commonComponentTemplatePath, renderData, {}, function (err, str) {
        fs.writeFileSync(pageDir + "/index.tsx", str);
      });
      ejs.renderFile(commonStyleTemplatePath, renderData, {}, function (err, str) {
        fs.writeFileSync(pageDir + "/index.module.scss", str);
      });
    }
  } catch (e) {
    console.log(e);
  }
  // const workspace = await vscode.workspace.workspaceFolders;
  // if (workspace) {
  //   const rootPath = workspace[0].uri.path;
  //   const microapps = fs.readdirSync(path.resolve(rootPath, MIC_PATH));
  //   const domains = fs.readdirSync(path.resolve(rootPath, DOMAIN_PATH));
  //   const app = await vscode.window.showQuickPick(microapps, { canPickMany: false });
  //   const pagePath = await vscode.window.showInputBox({
  //     password: false, // 输入内容是否是密码
  //     ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
  //     placeHolder: "请输入页面的路径", // 在输入框内的提示信息
  //     prompt: "完整页面路径为：子应用前缀+子应用basePath+页面路径，页面路径是以domains路径为起始的", // 在输入框下方的提示信息
  //     validateInput: function (text) {
  //       const isValid = /^(\/[a-zA-Z0-9-]+)+$/.test(text);
  //       const hasThisDomain = domains.includes(text.split("/")[1]);
  //       if (!isValid) { return "请输入符合规范的页面路径，例如: /${domain}/xxx/yyy"; }
  //       if (!hasThisDomain) { return "暂无此domain，请先添加domain"; }
  //       return undefined;
  //     }, // 对输入内容进行验证并返回
  //   });
  //   if (app && pagePath) {
  //     const appRoute = fs.readFileSync(path.resolve(rootPath, "./src/microapps", app, ROUTE_PATH));
  //     // TODO 对route源文件进行转移修改
  //   }
  // }
});