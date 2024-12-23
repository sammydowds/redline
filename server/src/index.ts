import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import matter from "front-matter";
const multer = require('multer')

const app = express();
const PORT = process.env.PORT || 5000;
const storage = multer.diskStorage({
  destination: (req: Request, file: File, cb: any) => {
    cb(null, '../posts/photos/'); 
  },
  filename: (req: Request, file: any, cb: any) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors())

app.post("/post/update", (req, res) => {
  const markdown = req.body.markdown;
  const data = matter(markdown) as any;
  const heading = data?.attributes?.title ? data?.attributes.title.replace(/[^a-zA-Z0-9]/g, '_') : 'untitled';
  const filePath = path.join(__dirname, "../../posts", `${heading.toLowerCase()}.md`);
  
  fs.writeFile(filePath, markdown, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error saving file." });
    }
    res.json({ message: "Post updated." });
  });
});

app.post('/photo/upload', upload.single('image'), (req, res) => {
  // @ts-ignore
  res.status(200).json({ message: 'File uploaded successfully!', url: req.file.path });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
