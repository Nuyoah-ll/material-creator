import vscode, { QuickPickItem } from "vscode";
import { globalState } from "../extension";
import { globalStateKey } from "../constants";

export const showMaterialNameInput = async (type: "组件" | "页面") => {
  const materialName = await vscode.window.showInputBox({
    // 这个对象中所有参数都是可选参数
    password: false, // 输入内容是否是密码
    ignoreFocusOut: false, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
    placeHolder: `请输入${type}名称`, // 在输入框内的提示信息
    prompt: "仅支持连字符或者是大/小驼峰", // 在输入框下方的提示信息
    validateInput: function (text) {
      return /^[a-zA-Z0-9-]+$/.test(text) ? undefined : "只能输入大小写英文字母、数字、短横线组合";
    }, // 对输入内容进行验证并返回
  });
  return materialName;
};

export const showPageFileSelector = async (rawItems: string[]) => {
  return new Promise<readonly QuickPickItem[]>((resolve) => {
    // 可选项
    const items = rawItems.map(item => {
      return {
        label: item,
        picked: false,
      };
    });
    // 缓存的被选择项
    const cachedSelectedItems: QuickPickItem[] | undefined = globalState.get(globalStateKey.PAGE_ITEMS);
    // 缓存的居然不是PickItem对象的内存地址，onDidChangeSelection应该做了一层拷贝，但是selectedItems需要传入相同的内存地址
    const selectedItem: QuickPickItem[] = [];
    items.forEach(item => {
      if (cachedSelectedItems?.find(it => it.label === item.label)) {
        selectedItem.push(item);
      }
    });
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = items;
    quickPick.selectedItems = selectedItem;
    quickPick.canSelectMany = true;
    quickPick.onDidChangeSelection((changedItems) => {
      globalState.update(globalStateKey.PAGE_ITEMS, changedItems);
    });
    quickPick.onDidAccept(() => {
      resolve(quickPick.selectedItems);
      quickPick.hide();
    });
    quickPick.show();
  });
};