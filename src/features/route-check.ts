import { TextDocument, TextEditor, window } from "vscode";
import vscode from "vscode";
import { isValidRouteFile } from "../utils/check.utils";
import fs from "fs";
import path from "path";
import strip from "strip-comments";

/**
 * 返回字符串在文档实例中的范围对象
 * @param document 文档实例
 * @param str 字符串
 * @returns 范围对象
 */
function getRange(document: TextDocument, str: string) {
  const result = document.getText().match(new RegExp(str));
  if (typeof result?.index === "number") {
    const startPos = document.positionAt(result?.index);
    const endPos = document.positionAt(result?.index + str.length);
    return new vscode.Range(startPos, endPos);
  }
}

/**
 * 从路由文件的内容中找到不合法的路由数组
 * @param routeContent 路由文件原始字符串
 * @returns 路由数组
 */
function findInvalidRouteConfig(routeContent: string) {
  const pathRegExp = /path: (".+"),/g;
  const domainPathRegExp = /import\((".+")\)/g;

  const paths = [...Array.from(routeContent.matchAll(pathRegExp)).map(item => item[1])];
  const domains = [...Array.from(routeContent.matchAll(domainPathRegExp)).map(item => item[1])];
  const invalidPaths = [];

  if (paths.length === domains.length) {
    for (let i = 0; i < paths.length; i++) {
      if (paths[i] !== domains[i].replace("@domains", "") && paths[i] !== '"*"') {
        invalidPaths.push(paths[i]);
      }
    }
  }
  return invalidPaths;
}

function highlighInvalidRoute(editor: TextEditor, route: string) {
  const underlineDecoration = window.createTextEditorDecorationType({
    textDecoration: 'red wavy underline'
  });
  const pathRange = getRange(editor.document, route);
  if (pathRange) {
    editor.setDecorations(underlineDecoration, [pathRange]);
  }
}


function onHandleVisibleEditorsChange(editors: readonly TextEditor[]) {
  editors.forEach((editor: TextEditor) => {
    const { document } = editor;
    const { fileName, uri } = document;
    if (isValidRouteFile(fileName)) {
      // 表明这是一个合法的路由文件
      const routeContent = document.getText();
      const invalidPaths = findInvalidRouteConfig(strip(routeContent));
      invalidPaths.forEach(item => highlighInvalidRoute(editor, item));
    }
  });
}


export function routeCheck() {
  const editors = window.visibleTextEditors;
  onHandleVisibleEditorsChange(editors);
  window.onDidChangeVisibleTextEditors(onHandleVisibleEditorsChange);
  createHoverForInvalidRoute();
}

function createHoverForInvalidRoute() {
  vscode.languages.registerHoverProvider('typescriptreact', {
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
      const { fileName, uri } = document;
      if (isValidRouteFile(fileName)) {
        // 表明这是一个合法的路由文件
        const routeContent = document.getText();
        const invalidPaths = findInvalidRouteConfig(strip(routeContent));
        const positionWordRange = document.getWordRangeAtPosition(position);
        const condition = invalidPaths.some(item => positionWordRange && getRange(document, item)?.contains(positionWordRange))
        if (condition) {
          const hover = new vscode.Hover(new vscode.MarkdownString("页面路径与域引用路径不匹配"));
          return hover;
        }
      }
      return null;
    }
  });
}