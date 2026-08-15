import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure upload directory exists if filesystem is writable
try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch {
  // Read-only filesystem (Vercel serverless environment)
}

export interface UploadResult {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
  publicUrl: string;
}

export async function saveUploadedFile(file: File, subfolder = ""): Promise<UploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || ".bin";
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${cleanName}_${timestamp}_${randomStr}${ext}`;
  const mimeType = file.type || "application/octet-stream";

  let filePath = "";
  let publicUrl = "";

  try {
    const targetDir = subfolder ? path.join(UPLOAD_DIR, subfolder) : UPLOAD_DIR;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    filePath = path.join(targetDir, fileName);
    await fs.promises.writeFile(filePath, buffer);
    publicUrl = subfolder ? `/uploads/${subfolder}/${fileName}` : `/uploads/${fileName}`;
  } catch (diskErr) {
    console.warn("Disk storage unavailable (Serverless/Vercel fallback to Data URL):", diskErr);
    // Convert to Base64 Data URL for serverless environment compatibility
    const base64 = buffer.toString("base64");
    publicUrl = `data:${mimeType};base64,${base64}`;
    filePath = `memory://${fileName}`;
  }

  return {
    originalName: file.name,
    fileName,
    mimeType,
    size: file.size,
    path: filePath,
    publicUrl,
  };
}

export async function deleteStoredFile(filePath: string): Promise<boolean> {
  try {
    if (filePath && !filePath.startsWith("memory://") && !filePath.startsWith("data:") && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return true;
  } catch (err) {
    console.error("Failed to delete stored file:", err);
    return false;
  }
}
