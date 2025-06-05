export function removeNullProperties<T>(obj: T): T {
  for (const key in obj) {
    if (obj[key] === null) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      obj[key] = removeNullProperties(obj[key]);
      if (Object.keys(obj[key]).length === 0 && obj[key].constructor === Object) {
        delete obj[key];
      }
    }
  }
  return obj;
}