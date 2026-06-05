import fs from 'fs';
import multer from 'multer';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const resumeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.fieldname === 'image') {
      if (imageTypes.includes(file.mimetype)) {
        return cb(null, true);
      }
      return cb(new Error('Only JPEG and PNG image files are allowed.'));
    }

    if (file.fieldname === 'resume') {
      if (resumeTypes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.docx')) {
        return cb(null, true);
      }
      return cb(new Error('Only PDF and DOCX resume files are allowed.'));
    }

    cb(new Error('Invalid upload field.'));
  }
});

export default upload;
