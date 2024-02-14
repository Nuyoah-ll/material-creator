export function toCamelCase(str: string, type: "upper" | "lower") {
  const pureStr = str.replace(/-\D/g, function (match) {
    return match.charAt(1).toUpperCase();
  });
  if (type === "upper") {
    return pureStr.charAt(0).toUpperCase() + pureStr.slice(1);
  } else if (type === "lower") {
    return pureStr.charAt(0).toLowerCase() + pureStr.slice(1);
  }
  return pureStr;
}

export function toHyphenated(str: string) {
  return str.replace(/\B([A-Z])/g, "-$1").toLowerCase();
}

export function getNoSuffixFilename(filename: string) {
  const parts = filename.split(".");
  const noSuffixParts = parts.length > 1 ? parts.slice(0, -1) : parts;
  return noSuffixParts.join(".");
}