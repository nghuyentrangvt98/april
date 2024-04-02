import admin from "firebase-admin";

export const getSignedUrl = async (path: string, durationInMinutes: number) => {
  const bucket = admin.storage().bucket();
  const blob = bucket.file(path);
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + durationInMinutes);
  const url = await blob.getSignedUrl({
    action: "read",
    expires: expirationDate,
  });
  return url;
};
