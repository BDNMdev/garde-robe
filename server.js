// server.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// 📁 Dossier des fichiers uploadés
const mediaDir = path.join(__dirname, 'media');
const subDirs = ['audio', 'video', 'image', 'docs','programme'];


subDirs.forEach(dir => {
  const fullPath = path.join(mediaDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Fonction de destination dynamique
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = getFileType(file.originalname); // 🔍 Détection du type par l'extension
    const folderMap = {
      document: 'docs',
      image: 'image',
      audio: 'audio',
      video: 'video',
      programme: 'programme',
    };

    const targetSubDir = folderMap[fileType] || 'autre'; // Fallback
    const targetDir = path.join(mediaDir, targetSubDir);

    // Crée le dossier s'il n'existe pas
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'BDNM' + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// 📂 Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/media', express.static(mediaDir));
app.use(express.json());

// 📤 Upload
app.post('/upload', upload.array('files'), (req, res) => {
  if (!req.files.length) return res.status(400).json({ message: 'Aucun fichier reçu' });
  res.status(200).json({ message: 'Fichiers reçus', files: req.files });
});

// 📁 Obtenir les fichiers de la galerie
// 📁 Obtenir tous les fichiers classés dans leurs sous-dossiers
app.get('/files', (req, res) => {
  const allFiles = [];

  subDirs.forEach(subDir => {
    const dirPath = path.join(mediaDir, subDir);

    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        allFiles.push({
          name: file,
          url: `/media/${subDir}/${file}`,
          type: subDir
        });
      });
    }
  });

  res.json(allFiles);
});


// Utilitaire : déterminer le type de fichier
function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (['.mp3', '.wav'].includes(ext)) return 'audio';
  if (['.mp4', '.webm'].includes(ext)) return 'video';
  if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) return 'image';
  if (['.pdf', '.doc', '.docx'].includes(ext)) return 'document';
  return 'autre';
}

app.listen(PORT, () => console.log(`✅ Serveur lancé : http://localhost:${PORT}`));
