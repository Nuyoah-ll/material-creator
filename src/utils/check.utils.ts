import { Uri } from "vscode";
import path from "path";
import fs from "fs";
import { invalidDomainName } from "../constants";

export const isUnderDomainsDir = (_path: string) => {
  const dirname = path.dirname(_path);
  return dirname.endsWith("/src/domains");
};

export const isPrimaryDomain = (_path: string) => {
  const basename = path.basename(_path);
  return isUnderDomainsDir(_path) && fs.statSync(_path).isDirectory() && !invalidDomainName.includes(basename);
};

export const isUnderPrimaryDomain = (_path: string) => {
  const dirname = path.dirname(_path);
  return isPrimaryDomain(dirname);
};

export const isValidRouteFile = (_path: string) => {
  const routeFilePath = /src\/microapps\/[a-zA-Z]+\/src\/routes.tsx/;
  return routeFilePath.test(_path);
};