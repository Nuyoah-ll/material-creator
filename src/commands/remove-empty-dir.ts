import vscode from "vscode";
import { removeEmptyDir } from "../utils/file.utils";

export const commandOfRemoveEmptyDir = vscode.commands.registerCommand("removeEmptyDir", async (uri) => {
  const confirmResult = await vscode.window.showQuickPick(["确定", "取消"], {
    title: "是否确定删除工作空间下的空文件夹？",
  });
  if (confirmResult === "确定") {
    const workspace = await vscode.workspace.workspaceFolders;
    if (workspace) {
      const rootPath = workspace[0].uri.path;
      try {
        removeEmptyDir(rootPath);
      } catch {
        vscode.window.showErrorMessage("删除工作空间下的空文件夹失败");
      }
      vscode.window.showInformationMessage("删除工作空间下的空文件夹成功");
    }
  }
});