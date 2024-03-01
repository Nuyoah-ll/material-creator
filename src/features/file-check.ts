import vscode, { FileDecoration, FileDecorationProvider, ThemeColor, Uri } from "vscode";
import { getNoSuffixFilename } from "../utils/string.utils";
import path from "path";
import fs from "fs";
import { ignoredFileOrDir, inherentFilesUnderTheDomainsDir } from "../constants";

export class FileCheckDecorationProvider implements FileDecorationProvider {
  disposables: vscode.Disposable[];
  constructor() {
    this.disposables = [];
    this.disposables.push(vscode.window.registerFileDecorationProvider(this));
  }

  provideFileDecoration(uri: Uri) {
    // TODO 1.文件的精细实现方式；2.警告装饰颜色被其他插件的FileDecoration覆盖的问题；3.连字符形式的命名仅仅是要求不能有大写？；4.根据规范来判断文件夹下的文件（夹）是否符合规范
    // 1.检查目录是否符合连字符规范
    const checkFilenameResult = this.checkFilename(uri);
    // 2.检查domain目录下结构是否符合规范
    const checkFileUnderDomainsResult = this.checkFileUnderDomainsDir(uri);
    const showText = [checkFilenameResult, checkFileUnderDomainsResult].filter(item => item).join("·");
    if(showText)  {
      return new FileDecoration("🔵", showText, new ThemeColor("materialCreator.filename.warning"));
    }
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }


  checkFilename(uri: Uri) {
    const filenameErrorText = "文件夹或者文件名称必须为连字符的形式";
    const filename = path.basename(uri.path);
    const noSuffixFilename = getNoSuffixFilename(filename);
    const isIgnored = ignoredFileOrDir.some(item => uri.path.includes(item));
    if (!isIgnored && /[A-Z]/.test(noSuffixFilename)) {
      return filenameErrorText;
    }
  }

  checkFileUnderDomainsDir(uri: Uri) {
    const fileUnderDomainsErrorText = "未知文件，请@lili添加文件说明";
    const filename = path.basename(uri.path);
    const dirname = path.dirname(uri.path);
    if (dirname.endsWith("/src/domains")) {
      if(!inherentFilesUnderTheDomainsDir.includes(filename)) {
        if(!fs.statSync(uri.path).isDirectory()) {
          return fileUnderDomainsErrorText;
        }else {
          // 表示这个是一个一级domain对应的文件夹
          const dirs = fs.readdirSync(uri.path);
          if(!dirs.includes("common")) {
            return "领域下必须包含common文件夹";
          }
        }
      }
    }
  }

  checkTheDomain(uri: Uri) {
    const filename = path.basename(uri.path);
    const dirname = path.dirname(uri.path);
    if (dirname.endsWith("/src/domains")) {
      // 表示这个是一个一级domain对应的文件夹
      if(!inherentFilesUnderTheDomainsDir.includes(filename) && fs.statSync(uri.path).isDirectory()) {
        const dirs = fs.readdirSync(uri.path);
        if(!dirs.includes("common")) {
          return "领域下必须包含common文件夹";
        }
      }
    }
  }
}