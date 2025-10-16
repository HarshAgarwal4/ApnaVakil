import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempFolder = path.resolve(__dirname, '../temp');

if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder, { recursive: true });
}

let TempStorage = multer.diskStorage({
  destination: tempFolder,
  filename: function (req, file, cb) {
    const name = req.user?.id || 'guest';
    cb(null, name + '-' + file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadTemp = multer({ storage: TempStorage });

export { TempStorage, uploadTemp };
