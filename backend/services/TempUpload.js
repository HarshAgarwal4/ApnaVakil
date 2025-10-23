import multer from 'multer';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Use system temp directory for production-safe writes
// In production (serverless) — only /tmp is writable
// In local dev — it also works fine
const tempFolder = path.join(os.tmpdir(), 'uploads');

// ✅ Ensure the temp directory exists
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder, { recursive: true });
  console.log('✅ Temp directory created at:', tempFolder);
} else {
  console.log('✅ Using existing temp directory:', tempFolder);
}

// ✅ Configure multer storage
const TempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempFolder);
  },
  filename: (req, file, cb) => {
    const user = req.user?.id || 'guest';
    const uniqueName = `${user}-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// ✅ Create multer upload instance
const uploadTemp = multer({ storage: TempStorage });

export { TempStorage, uploadTemp };
