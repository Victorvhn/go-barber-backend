import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tempFolter = path.resolve(__dirname, '..', '..', 'temp');

export default {
  directory: tempFolter,
  storage: multer.diskStorage({
    destination: tempFolter,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
