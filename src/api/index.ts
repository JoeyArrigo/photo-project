import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { generatePhotoDescription } from './llm';
import { 
  storePhotoDescription, 
  getAllPhotoDescriptions,
  getPhotoDescription 
} from './db';

// Set up Express app
const app = express();
const port = process.env.PORT || 3001;

// Configure CORS
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed') as any);
    }
  }
});

// Route to upload and process a photo
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Generate description using Ollama
    const description = await generatePhotoDescription(filePath);

    // Store description in Supabase
    const photoRecord = await storePhotoDescription(fileName, description, filePath);

    res.status(201).json(photoRecord);
  } catch (error) {
    console.error('Error processing photo:', error);
    res.status(500).json({ error: 'Failed to process photo' });
  }
});

// Route to get all photo descriptions
app.get('/api/photos', async (req, res) => {
  try {
    const photos = await getAllPhotoDescriptions();
    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// Route to get a specific photo description
app.get('/api/photos/:id', async (req, res) => {
  try {
    const photo = await getPhotoDescription(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json(photo);
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
