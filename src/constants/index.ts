export const allReactHOCTypes = ["none", "memo", "forwardRef"];

export const globalStateKey = {
  PAGE_ITEMS: "PAGE_ITEMS"
};

export const projectName = "logistics-center-partner-subapp";

export const ignoredFileOrDir = [
  "node_modules",
];

// interface DirectoryStructure {
//   name: string | RegExp;
//   type: "file" | "dir",
//   isNecessary?: boolean;
//   reference?: () => DirectoryStructure[]
// }

// export const commonDir: DirectoryStructure[] = [
//   {
//     name: "utils",
//     type: "file",
//   },
//   {
//     name: "utils",
//     type: "dir",
//   },
//   {
//     name: "components",
//     type: "dir",
//   },
//   {
//     name: "static",
//     type: "dir",
//   },
//   {
//     name: "constants",
//     type: "dir",
//   },
//   {
//     name: "store",
//     type: "dir",
//   },
//   {
//     name: "models",
//     type: "dir",
//   },
//   {
//     name: "hooks",
//     type: "dir",
//   }
// ];

// export const domainDir: DirectoryStructure[] = [
//   {
//     name: 'common',
//     type: "dir",
//     isNecessary: true,
//     reference: () => commonDir
//   },
//   {
//     name: "index.tsx",
//     type: "file",
//   },
//   {
//     name: "index.module.scss",
//     type: "file",
//   },
//   {
//     name: "columns.tsx",
//     type: "file",
//   },
//   {
//     name: "api.ts",
//     type: "file",
//   },
//   {
//     name: "types.ts",
//     type: "file",
//   },
//   {
//     name: /![A-Z]/,
//     type: "dir",
//     isNecessary: false,
//     reference: () => domainDir
//   },
// ];