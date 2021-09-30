/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }

  if (size === 0) {
    return "";
  }

  let result = "";
  for (const sym of string) {
    if (result.endsWith(sym.repeat(size))) {
      continue;
    } else {
      result += sym;
    }
  }

  return result;
}
