export const objToId = (obj: Record<string, any>): string => {
  // 将对象的键值对转换为数组，并按照键排序
  const sortedEntries = Object.entries(obj).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  // 将排序后的键值对转换为字符串
  const str = sortedEntries
    .map(([key, value]) => {
      if (typeof value === "object") {
        return `${key}:${objToId(value)}`;
      }
      return `${key}:${value}`;
    })
    .join("&");

  // 使用哈希函数创建一个唯一的字符串标识符
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(str);
  return hasher.digest("base64");
};

type AnyObject = Record<string, any>;

export function mergeTwoObjects(obj1: AnyObject, obj2: AnyObject): AnyObject {
  const result: AnyObject = { ...obj1 };
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key) && obj2[key] !== undefined) {
      result[key] = obj2[key];
    }
  }
  return result;
}
