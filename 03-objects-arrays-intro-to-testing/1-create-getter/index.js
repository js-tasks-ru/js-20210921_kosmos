/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  path = path.split(".");

  return function (obj) {
    let result = obj;

    for (const prop of path) {
      if (result.hasOwnProperty(prop)) {
        result = result[prop];
      } else {
        return;
      }

      if (result === undefined || result === null) {
        break;
      }
    }

    return result;
  };
}
