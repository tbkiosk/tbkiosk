import { sha256 } from "@noble/hashes/sha256";

export const plainTextToHash = (plainText: string) =>
  Buffer.from(sha256(plainText)).toString("hex");
