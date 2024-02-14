import fs from "fs";
import path from "path";
import { window } from "vscode";

/**
 * 检查是否为空文件夹
 * @param dirPath 绝对路径
 * @returns true/false
 */
export const checkEmptyDir = (dirPath: string) => {
  const stat = fs.statSync(dirPath);
  if (stat.isDirectory()) {
    const subDirs = fs.readdirSync(dirPath);
    return subDirs.length <= 0;
  }
  return false;
};

/**
 * 递归地移除空文件夹
 * @param dirPath 文件夹
 */
export const removeEmptyDir = (dirPath: string) => {
  if (!fs.statSync(dirPath).isDirectory()) {
    return;
  }
  if (checkEmptyDir(dirPath)) {
    fs.rmdirSync(dirPath);
  } else {
    fs.readdirSync(dirPath)
      .filter(subDirName => !/^\./g.test(subDirName) || ["node_modules"].includes(subDirName))
      .filter(subDirName => fs.statSync(path.resolve(dirPath, subDirName)).isDirectory())
      .forEach(subDirName => removeEmptyDir(path.resolve(dirPath, subDirName)));
  }
};