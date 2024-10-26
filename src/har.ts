import type { Har } from "@/interface";
import { file } from "bun";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const getFileListFromDir = async (dirPath: string) => {
  const filePathList: string[] = [];
  const relativeFilePathList = await readdir(dirPath, { recursive: true });
  for (const relativeFilePath of relativeFilePathList) {
    const fullPath = join(dirPath, relativeFilePath);
    const bunFile = file(fullPath);
    const isExists = await bunFile.exists();
    if (isExists && relativeFilePath.endsWith(".har")) {
      filePathList.push(fullPath);
    }
  }
  return filePathList;
};

export const getHarFileList = async (dirPath: string) => {
  const filePathList = await getFileListFromDir(dirPath);
  const result: Har[] = [];
  for (const filePath of filePathList) {
    const harFile = file(filePath);
    const har: Har = await harFile.json();
    result.push(har);
  }
  return result;
};
