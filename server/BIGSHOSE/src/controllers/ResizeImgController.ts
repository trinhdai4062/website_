// src/controllers/ShoseController.ts
import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import axios from 'axios';
import {stringToSlug} from '../../src/utils/Confixfont'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/'); // Đường dẫn thư mục lưu trữ tệp
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = stringToSlug(file.originalname.replace(ext, ''));
        cb(null,`${baseName}${ext}`)
    //   cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên tệp
    }
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
  });
  

export class ResizeController {

    public async RESIZE_IMG(req: Request, res: Response): Promise<void> {
        const { url, width, height } = req.query;
        if (!url || !width || !height) {
            res.status(400).send('Missing required query parameters: url, width, height');
        }
        try {
            const imagePath = path.join(__dirname, '../../images', path.basename(url as string));
            const outputPath = path.join(__dirname, '../../resized', `${path.basename(url as string, path.extname(url as string))}-${width}x${height}${path.extname(url as string)}`);
            if (fs.existsSync(outputPath)) {
                return res.sendFile(outputPath);
            }

            await sharp(imagePath)
                .resize(parseInt(width as string), parseInt(height as string))
                .toFile(outputPath);

            return res.sendFile(outputPath);
        } catch (error) {
            console.error('Error processing image:', error);
            res.status(500).send('Error processing image');
        }
    }
    public async UP_IMG(req: Request, res: Response): Promise<void> {
        // Cấu hình lưu trữ tệp
        const storage = multer.diskStorage({
            destination: function (req, file: Express.Multer.File, cb) {
                cb(null, 'images/');
            },
            filename: function (req, file: Express.Multer.File, cb) {
                const ext = path.extname(file.originalname);
                const baseName = stringToSlug(file.originalname.replace(ext, ''));
                let fileName = baseName + ext;
    
                if (fs.existsSync(path.join('images/', fileName))) {
                    const error = new Error('File already exists');
                    cb(error, fileName); 
                } else {
                    cb(null, fileName);
                }
            }
        });
    
        const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } }).array('files', 20);
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    res.status(500).json({ error: 'Too many files uploaded' });
                } else if (err.code === 'LIMIT_FILE_SIZE') {
                    res.status(500).json({ error: 'File size limit exceeded' });
                } else {
                    res.status(500).json({ error: err.message });
                }
            } else if (err) {
                if (err.message === 'File already exists') {
                    res.status(409).json({ error: `File name: "${err.path}" already exists` });
                } else {
                    res.status(500).json({ error: err.message });
                }
            } else {
                // Upload thành công
                res.status(200).json({ message: 'File uploaded successfully' });
            }
        });
    }
    // Chỉnh sửa phương thức downloadImage
    static async downloadImage(url: string, index: number): Promise<string> {
        try {
            // console.log('url',url)
            const response = await axios.get(url, { responseType: 'stream' });
            let imageName = path.basename(url);
            imageName=stringToSlug(imageName);
            const imageDir = path.join(__dirname, '../../images');
            let imagePath = path.join(imageDir, imageName);
            // console.log('index',index)

            // Tạo thư mục nếu chưa tồn tại
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, { recursive: true });
            }

            // Kiểm tra và xử lý nếu tên tệp đã tồn tại
            if (fs.existsSync(imagePath)) {
                const ext = path.extname(imageName);
                const baseName = path.basename(imageName, ext);
                imageName = `${baseName}${ext}`;
                imagePath = path.join(imageDir, imageName);
                // console.log('imagePath',imagePath)
            }
            response.data.pipe(fs.createWriteStream(imagePath));

            return new Promise((resolve, reject) => {
                response.data.on('end', () => resolve(imageName));
                response.data.on('error', (err: any) => reject(err));
            });
        } catch (error: any) {
            console.error('Error downloading image:', error.message);
            throw new Error('Error downloading image');
        }
    }
    // Chỉnh sửa phương thức DOWNLOAD_IMG
    
    public async DOWNLOAD_IMG(req: Request, res: Response): Promise<void> {
        const imageUrls: string[] = req.body.imageUrls; 
        try {
            const downloadedImages = await Promise.all(imageUrls.map((url,index) => ResizeController.downloadImage(url,index)));
            console.log('Downloaded images:', downloadedImages);
            res.status(200).json({ message: 'Images downloaded successfully', downloadedImages });
        } catch (error) {
            console.error('Error downloading images:', error);
            res.status(500).json({ error: 'Error downloading images' });
        }
    }
    public async UP_IMG_DEPSCRIP(req: Request, res: Response): Promise<void> {
        upload.single('file')(req, res, (err) => {
          if (err) {
            console.error('Error uploading image:', err);
            return res.status(500).json({ error: 'Error uploading image', details: err.message });
          }
          if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
          }
          res.json({ url: `/images/${req.file.filename}` });
        });
      }
    
      public async UP_VIDEO_DEPSCRIP(req: Request, res: Response): Promise<void> {
        upload.single('file')(req, res, (err) => {
          if (err) {
            console.error('Error uploading video:', err);
            return res.status(500).json({ error: 'Error uploading video', details: err.message });
          }
          if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
          }
          res.json({ url: `/images/${req.file.filename}` });
        });
      }


}
