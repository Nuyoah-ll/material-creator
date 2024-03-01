export const allReactHOCTypes = ["none", "memo", "forwardRef"];

export const globalStateKey = {
  PAGE_ITEMS: "PAGE_ITEMS"
};

export const projectName = "logistics-center-partner-subapp";

// 拼音检查忽略的文件/文件夹
export const spellCheckIgnoredFileOrDir = [
  "node_modules",
  "README.md",
  "CODEOWNERS",
  "App.tsx"
];

// domains文件夹下一些固有的文件/目录，后续新增的需要给出提示
export const inherentFilesUnderTheDomainsDir = [
  ".gitkeep",
  "declaration.d.ts",
  "package.json",
  "tsconfig.json",
  "types.ts",
  "typings",
  "node_modules",
];

// 领域下固有的一些文件
export const inherentFilesUnderSomeDomain = [
  "config.ts",
  "types.ts",
  "api.ts"
];

// 不合法的领域名称
export const invalidDomainName = [
  "typings",
  "typing",
  "node_modules",
];

export const tipMap: Record<number, string> = {
  1: '❶',
  2: '❷',
  3: '❸',
  4: '❹',
  5: '❺',
  6: '❻',
  7: '❼',
  8: '❽',
  9: '❾',
};