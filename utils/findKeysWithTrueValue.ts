export const findKeysWithValue = (obj: any, searchValue: any): string[] => {
  const keys: string[] = [];

  const search = (obj: any, currentPath: string) => {
    for (const key in obj) {
      if (obj[key] === searchValue) {
        keys.push(currentPath + '.' + key);
      } else if (typeof obj[key] === 'object') {
        search(obj[key], currentPath + '.' + key);
      }
    }
  }

  search(obj, '');

  // Remove the leading dot from keys
  return keys.map(key => key.slice(1));
}