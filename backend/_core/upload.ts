import type { Request } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "./env";
import path from "path";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    if (!ENV.awsBucket || !ENV.awsAccessKeyId || !ENV.awsSecretAccessKey) {
      throw new Error("AWS S3 not configured: set AWS_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY");
    }
    s3Client = new S3Client({
      region: ENV.awsRegion,
      credentials: {
        accessKeyId: ENV.awsAccessKeyId,
        secretAccessKey: ENV.awsSecretAccessKey,
      },
    });
  }
  return s3Client;
}

/**
 * Universal S3 upload middleware. Use for any table that needs file uploads.
 * Folder is read from req.params.folder (route: /api/upload/:folder)
 */
export function createUploadMiddleware(fieldName = "file") {
  return multer({
    storage: multerS3({
      s3: getS3Client(),
      bucket: ENV.awsBucket,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      // acl: "public-read",
      metadata: (_req: Request, file, cb) => cb(null, { fieldName: file.fieldname }),
      key: (req: Request, file, cb) => {
        const folder = (req.params as { folder?: string }).folder ?? "misc";
        const ext = path.extname(file.originalname) || ".bin";
        const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
        cb(null, `${folder}/${name}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  }).single(fieldName);
}

export function isUploadConfigured(): boolean {
  return Boolean(ENV.awsBucket && ENV.awsAccessKeyId && ENV.awsSecretAccessKey);
}
