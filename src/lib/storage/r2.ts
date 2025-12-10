import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

import env from "../../config/env.js";

const r2Client = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accountId: env.R2_ACCOUNT_ID,
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = env.R2_BUCKET_NAME;
const PUBLIC_URL = env.R2_PUBLIC_URL;

export class R2StorageService {
  static async uploadImage(
    imageBuffer: Buffer,
    mimeType: string
  ): Promise<{ url: string; key: string }> {
    const key = `images/${uuidv4()}.${this.getFileExtensionFromMimeType(mimeType)}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: mimeType,
    });

    try {
      await r2Client.send(command);
      return {
        url: `${PUBLIC_URL}/${key}`,
        key,
      };
    } catch (error) {
      console.error("R2 upload error:", error);
      throw new Error("Failed to upload image to R2");
    }
  }

  static async uploadBase64Image(
    base64Data: string
  ): Promise<{ url: string; key: string }> {
    // Remove data URL prefix if present
    const base64Content = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");
    const imageBuffer = Buffer.from(base64Content, "base64");

    // Detect MIME type from base64 data
    const mimeType = this.detectMimeTypeFromBase64(base64Data);
    return this.uploadImage(imageBuffer, mimeType);
  }

  static async getSignedUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    console.log("ke sini");

    try {
      return await getSignedUrl(r2Client, command, { expiresIn });
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new Error("Failed to generate signed URL");
    }
  }

  private static getFileExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/bmp": "bmp",
      "image/svg+xml": "svg",
    };

    return mimeToExt[mimeType] || "jpg";
  }

  private static detectMimeTypeFromBase64(base64Data: string): string {
    // Check the data URL prefix first
    const match = base64Data.match(/^data:(image\/[a-z]+);base64,/);
    if (match) {
      return match[1];
    }

    // Fallback: try to detect from the first few bytes
    const buffer = Buffer.from(
      base64Data.replace(/^data:image\/[a-z]+;base64,/, ""),
      "base64"
    );
    const firstBytes = buffer.subarray(0, 8);

    // JPEG
    if (
      firstBytes[0] === 0xff &&
      firstBytes[1] === 0xd8 &&
      firstBytes[2] === 0xff
    ) {
      return "image/jpeg";
    }

    // PNG
    if (
      firstBytes[0] === 0x89 &&
      firstBytes[1] === 0x50 &&
      firstBytes[2] === 0x4e &&
      firstBytes[3] === 0x47
    ) {
      return "image/png";
    }

    // WebP
    if (
      firstBytes[8] === 0x57 &&
      firstBytes[9] === 0x45 &&
      firstBytes[10] === 0x42 &&
      firstBytes[11] === 0x50
    ) {
      return "image/webp";
    }

    // GIF
    if (
      firstBytes[0] === 0x47 &&
      firstBytes[1] === 0x49 &&
      firstBytes[2] === 0x46
    ) {
      return "image/gif";
    }

    // Default to JPEG
    return "image/jpeg";
  }
}
