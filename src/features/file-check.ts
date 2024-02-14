import vscode, { FileDecoration, FileDecorationProvider, ThemeColor, Uri } from "vscode";
import { getNoSuffixFilename } from "../utils/string.utils";
import path from "path";
import { ignoredFileOrDir } from "../constants";

export class FileCheckDecorationProvider implements FileDecorationProvider {
  disposables: vscode.Disposable[];
  constructor() {
    this.disposables = [];
    this.disposables.push(vscode.window.registerFileDecorationProvider(this));
  }

  provideFileDecoration(uri: Uri) {
    // 1.检查目录是否符合连字符规范
    const filename = path.basename(uri.path);
    const noSuffixFilename = getNoSuffixFilename(filename);
    // TODO 1.文件的精细实现方式；2.警告装饰颜色被其他插件的FileDecoration覆盖的问题；3.连字符形式的命名仅仅是要求不能有大写？；4.根据规范来判断文件夹下的文件（夹）是否符合规范
    const isIgnored = ignoredFileOrDir.some(item => uri.path.includes(item));
    if (!isIgnored && /[A-Z]/.test(noSuffixFilename)) {
      return new FileDecoration("⚠️", "文件夹或者文件名称必须为连字符的形式", new ThemeColor("materialCreator.filename.warning"));
    }
    // 2.检查domain目录结构是否符合规范
    // if (uri.path.endsWith("/src/domains")) {
    //   let dirs = fs.readdirSync(uri.path);
    //   dirs = dirs.filter(dir => fs.statSync(path.resolve(uri.path, dir)).isDirectory());
    //   console.log(dirs);
    // }
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }
}