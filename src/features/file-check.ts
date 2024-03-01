import vscode, { FileDecoration, FileDecorationProvider, ThemeColor, Uri } from "vscode";
import { getNoSuffixFilename } from "../utils/string.utils";
import path from "path";
import fs from "fs";
import { spellCheckIgnoredFileOrDir, inherentFilesUnderSomeDomain, inherentFilesUnderTheDomainsDir, tipMap } from "../constants";
import { isPrimaryDomain, isUnderDomainsDir, isUnderPrimaryDomain } from "../utils/check.utils";
import { readDirs } from "../utils/file.utils";

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
    // 3.检查一级域目录下的结构是否符合规范
    const checkTheDomainResult = this.checkPrimaryDomain(uri);
    const tipsArr = [checkFilenameResult, checkFileUnderDomainsResult, checkTheDomainResult].filter(item => item);
    const showText = tipsArr.join("·");
    if (showText) {
      return new FileDecoration(tipMap[tipsArr.length], showText, new ThemeColor("materialCreator.filename.error"));
    }
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }

  // 检查文件或者文件夹是否是非连字符形式
  checkFilename(uri: Uri) {
    const filenameErrorText = "文件夹或者文件名称必须为连字符的形式";
    const filename = path.basename(uri.path);
    const noSuffixFilename = getNoSuffixFilename(filename);
    const isIgnored = spellCheckIgnoredFileOrDir.some(item => uri.path.includes(item));
    if (!isIgnored && /[A-Z]/.test(noSuffixFilename)) {
      return filenameErrorText;
    }
  }

  // 检查位于src/domains下的文件/文件夹
  checkFileUnderDomainsDir(uri: Uri) {
    const unknownFileUnderDomains = "未知文件，请@lili添加文件说明";
    if (isUnderDomainsDir(uri.path)) {
      const filename = path.basename(uri.path);
      if (!inherentFilesUnderTheDomainsDir.includes(filename)) {
        if (!fs.statSync(uri.path).isDirectory()) {
          return unknownFileUnderDomains;
        }
      }
    }
  }

  // 检查领域文件夹本身
  checkPrimaryDomain(uri: Uri) {
    const lackOfCommonFile = "领域下缺失common文件夹";
    if (isPrimaryDomain(uri.path)) {
      const { files, folders } = readDirs(uri.path);
      // 领域下缺失common文件夹
      if (!folders.includes("common")) {
        return lackOfCommonFile;
      }
    }
  }

  // 检查某个领域文件夹下的文件/文件夹
  checkFileUnderPrimaryDomain(uri: Uri) {
    if (isUnderPrimaryDomain(uri.path)) {
      // 当前文件在某个域下
      // TODO
    }
  }
};