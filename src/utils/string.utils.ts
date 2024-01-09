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