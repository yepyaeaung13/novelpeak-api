// plugins/b2.ts
import { S3Client } from "@aws-sdk/client-s3";

export const b2Client = new S3Client({
  region: "us-east-005", // your region
  endpoint: "https://s3.us-east-005.backblazeb2.com",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  },
});