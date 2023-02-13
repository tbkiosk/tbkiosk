import { sha256 } from "@noble/hashes/sha256";
import { randomBytes } from "@noble/hashes/utils";

export const plainTextToHash = (
  plainText: string | Uint8Array = randomBytes()
) => Buffer.from(sha256(plainText)).toString("hex");
