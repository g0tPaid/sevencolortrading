import { createHash } from "crypto";

export function eventFingerprint(parts: {
  time: string;
  stage: string;
  description: string;
  location: string;
  tie: string;
}): string {
  return createHash("sha256")
    .update([parts.time, parts.stage, parts.description, parts.location, parts.tie].join("\u001f"))
    .digest("hex");
}
