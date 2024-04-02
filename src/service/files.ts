import { getSignedUrl } from "./storage";

import { getFilebyID } from "../repo/file";

export const getFile = async (id: string) => {
  const file = await getFilebyID(id).lean();
  if (!file) {
    return null;
  }
  const url = await getSignedUrl(file.path, 30);
  return { ...file, url: url };
};
