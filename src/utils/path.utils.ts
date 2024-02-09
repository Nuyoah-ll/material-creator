import path from "path";
import vscode from "vscode";

/**
 * 获取插件运行时工作空间下的根绝对路径
 */
export const getWorkSpaceRootPath = async () => {
  const workspace = await vscode.workspace.workspaceFolders;
  if (workspace) {
    return workspace[0].uri.path;
  } else {
    return Promise.reject();
  }
};

/**
 * 获取插件源码下常用的目录绝对路径
 */
export const getFrequentlyUsedPath = () => {
  const templatesPath = path.resolve(__dirname, "../templates");
  const componentTemplatesPath = path.resolve(templatesPath, "components");
  const styleTemplatesPath = path.resolve(templatesPath, "styles");
  const pageTemplatesPath = path.resolve(templatesPath, "pages");
  return {
    templatesPath,
    componentTemplatesPath,
    styleTemplatesPath,
    pageTemplatesPath
  };
};

/**
 * 获取组件ejs模板的绝对路径，用于ejs api渲染
 * @param reactHOCType 组件模板采用的高阶组件类型
 * @param componentType 组件模板的组件类型
 */
export const getComponentTemplate = (reactHOCType = "none", componentType = "common") => {
  return path.resolve(getFrequentlyUsedPath().componentTemplatesPath, componentType, `${componentType}.${reactHOCType}.ejs`);
};

/**
 * 获取样式ejs模板的绝对路径，用于ejs api渲染
 */
export const getStyleTemplate = () => {
  return path.resolve(getFrequentlyUsedPath().styleTemplatesPath, "common.ejs");
};