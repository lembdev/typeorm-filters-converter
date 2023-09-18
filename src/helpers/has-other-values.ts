export const hasOtherValues = <T>(obj: T, targetKey: keyof T): boolean =>
  Object.entries(obj as object).some(([key, val]) => {
    if (key === targetKey) return false;
    return val !== undefined && val !== null;
  });
